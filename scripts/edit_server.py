from flask import Flask, request, jsonify, make_response
from urllib.parse import quote,unquote
from html import escape
from datetime import datetime, timedelta
import os
import json
import hashlib
from copy import deepcopy
import hmac
import secrets
import time
from werkzeug.utils import secure_filename
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)

# 允许特定头部和凭证
CORS(app, 
     supports_credentials=True,
     allow_headers=['X-Token', 'X-Signature', 'Content-Type'],
     methods=['GET', 'POST', 'OPTIONS'])

# 配置目录
SECRETS_DIR = os.path.join(os.getcwd(), "./secrets")
CONFIG_DIR = os.path.abspath(os.path.join(os.getcwd(), '../public/config'))
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}
MAX_FILE_SIZE = 24 * 1024 * 1024  # 24MB

# 创建必要的目录
os.makedirs(SECRETS_DIR, exist_ok=True)
os.makedirs(CONFIG_DIR, exist_ok=True)
os.makedirs(CONFIG_DIR, exist_ok=True)

# 初始化默认用户文件
USERS_FILE = os.path.join(SECRETS_DIR, "users.json")
SESS_FILE = os.path.join(SECRETS_DIR, "sessions.json")
if not os.path.exists(USERS_FILE):
    default_users = {
        "admin": "admin123",
    }
    with open(USERS_FILE, 'w') as f:
        json.dump(default_users, f)

# 存储tokens和相关信息的内存字典
active_tokens = {}  # token -> {user, expire_time, sk}
upload_tokens = {}  # upload_token -> {user, token, expire_time}

def generate_token():
    return secrets.token_urlsafe(32)

def generate_sk():
    return secrets.token_urlsafe(64)

def get_user_passwords():
    """获取用户密码字典"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

if os.path.exists(SESS_FILE):
    try:
        with open(SESS_FILE, 'r') as f:
            tks = json.load(f)
        for key in tks :
            tks[key]['expire_time'] = datetime.fromisoformat(tks[key]['expire_time'])
        active_tokens = tks
    except:
        pass

def validate_path(path):
    """验证路径安全性"""
    # 移除开头的斜杠
    clean_path = path.lstrip('/')
    # 检查是否包含非法字符或路径遍历
    if '..' in clean_path or './' in clean_path:
        return None
    return clean_path

def verify_signature(message, signature, sk):
    """验证消息签名"""
    expected_signature = hmac.new(
        sk.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        users = get_user_passwords()
        
        if username not in users or users[username] != password:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # 生成登录token和sk
        token = generate_token()
        sk = generate_sk()
        
        # 设置24小时后过期
        expire_time = datetime.now() + timedelta(hours=24)
        
        # 存储token信息
        active_tokens[token] = {
            'user': username,
            'expire_time': expire_time,
            'sk': sk
        }
        
        with open(SESS_FILE, 'w', encoding='utf-8') as f:
            tks = deepcopy(active_tokens)
            for key in tks:
                tks[key]['expire_time'] = tks[key]['expire_time'].isoformat()
            json.dump(tks, f, indent=2)

        response = make_response(jsonify({
            "message": "Login successful",
            "token": token,
            "sk": sk
        }))
        response.headers['X-Token'] = token
        return response
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def authenticate_request():
    """验证请求是否已登录且token有效"""
    token = request.headers.get('X-Token')
    
    if not token:
        return None, "Missing token header"
    
    if token not in active_tokens:
        return None, "Invalid token"
    
    token_info = active_tokens[token]
    
    if datetime.now() > token_info['expire_time']:
        del active_tokens[token]
        return None, "Token expired"
    
    # 验证消息签名
    signature = request.headers.get('X-Signature')
    if not signature:
        return None, "Missing signature"
    
    # 构造待验证的消息
    message_parts = [
        request.method,
        request.path,
        '&'.join([f"{k}={v}" for k, v in sorted(request.args.items())])
    ]
    message = '|'.join(message_parts)
    
    if not verify_signature(message, signature, token_info['sk']):
        return None, "Invalid signature"
    
    return token_info['user'], None

@app.route('/dir', methods=['GET'])
def dir_ls():
    user, error = authenticate_request()
    if error:
        return jsonify({"error": error}), 401
    
    path = request.args.get('path')
    if not path:
        path = ''
    
    clean_path = validate_path(path)
    if not clean_path:
        return jsonify({"error": "Invalid path"}), 400
    
    full_path = os.path.join(CONFIG_DIR, clean_path)

    print(full_path)
    
    # 确保路径在配置目录下
    if not full_path.startswith(os.path.abspath(CONFIG_DIR)):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        content = list_directory(full_path)
        return jsonify(content)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/json/read', methods=['GET'])
def read_json():
    user, error = authenticate_request()
    if error:
        return jsonify({"error": error}), 401
    
    path = request.args.get('path')
    if not path:
        return jsonify({"error": "Path parameter required"}), 400
    
    clean_path = validate_path(path)
    if not clean_path:
        return jsonify({"error": "Invalid path"}), 400
    
    full_path = os.path.join(CONFIG_DIR, clean_path)
    
    # 确保路径在配置目录下
    if not full_path.startswith(os.path.abspath(CONFIG_DIR)):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        if not os.path.exists(full_path):
            return jsonify({"error": "File not found"}), 404
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        return jsonify(content)
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON file"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/json/write', methods=['POST'])
def write_json():
    user, error = authenticate_request()
    if error:
        return jsonify({"error": error}), 401
    
    path = request.args.get('path')
    if not path:
        return jsonify({"error": "Path parameter required"}), 400
    
    clean_path = validate_path(path)
    if not clean_path:
        return jsonify({"error": "Invalid path"}), 400
    
    full_path = os.path.join(CONFIG_DIR, clean_path)
    
    # 确保路径在配置目录下
    if not full_path.startswith(os.path.abspath(CONFIG_DIR)):
        return jsonify({"error": "Access denied"}), 403
    
    try:
        # 确保目录存在
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        data = request.get_json()
        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        return jsonify({"message": "JSON file written successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload/token', methods=['GET'])
def get_upload_token():
    user, error = authenticate_request()
    if error:
        return jsonify({"error": error}), 401
    
    # 生成上传token
    upload_token = generate_token()
    
    # 设置5分钟后过期
    expire_time = datetime.now() + timedelta(minutes=5)
    
    upload_tokens[upload_token] = {
        'user': user,
        'login_token': request.headers.get('X-Token'),  # 关联登录token
        'expire_time': expire_time
    }
    
    return jsonify({
        "upload_token": upload_token,
        "expires_in": 300  # 5 minutes in seconds
    })

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    upload_token = request.headers.get('X-Upload-Token')
    
    if not upload_token:
        return jsonify({"error": "Missing upload token"}), 401
    
    if upload_token not in upload_tokens:
        return jsonify({"error": "Invalid upload token"}), 401
    
    token_info = upload_tokens[upload_token]
    
    if datetime.now() > token_info['expire_time']:
        del upload_tokens[upload_token]
        return jsonify({"error": "Upload token expired"}), 401
    
    # 验证是否仍关联有效的登录token
    if token_info['login_token'] not in active_tokens:
        del upload_tokens[upload_token]
        return jsonify({"error": "Associated login session expired"}), 401
    
    login_token_info = active_tokens[token_info['login_token']]
    if datetime.now() > login_token_info['expire_time']:
        del active_tokens[token_info['login_token']]
        del upload_tokens[upload_token]
        return jsonify({"error": "Login session expired"}), 401
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 401
    
    # 检查文件大小
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    if file_length > MAX_FILE_SIZE:
        return jsonify({"error": f"File too large. Max size is {MAX_FILE_SIZE // (1024*1024)}MB"}), 400
    file.seek(0)  # 重置文件指针
    
    # 验证是否为真实图片
    try:
        img = Image.open(file.stream)
        img.verify()
        file.seek(0)  # 重置文件指针
    except:
        return jsonify({"error": "Invalid image file"}), 400
    
    path = request.args.get('path', '')
    clean_path = validate_path(path)
    if not clean_path:
        return jsonify({"error": "Invalid path"}), 400
    
    # 创建最终保存路径
    base_dir = os.path.join(CONFIG_DIR, os.path.dirname(clean_path))
    os.makedirs(base_dir, exist_ok=True)
    
    # 生成哈希化的文件名
    file_content = file.read()
    file_hash = hashlib.md5(file_content).hexdigest()
    extension = os.path.splitext(file.filename)[1]
    hashed_filename = f"{file_hash}{extension}"
    
    final_path = os.path.join(base_dir, hashed_filename)
    
    # 写入文件
    with open(final_path, 'wb') as f:
        f.write(file_content)
    
    # 返回文件访问路径
    relative_path = os.path.relpath(final_path, CONFIG_DIR)
    return jsonify({
        "message": "File uploaded successfully",
        "filename": hashed_filename,
        "path": relative_path,
        "full_path": final_path
    })

@app.route('/logout', methods=['POST'])
def logout():
    token = request.headers.get('X-Token')
    
    if token and token in active_tokens:
        del active_tokens[token]
    
    # 删除关联的上传token
    tokens_to_delete = []
    for utoken, info in upload_tokens.items():
        if info['login_token'] == token:
            tokens_to_delete.append(utoken)
    
    for utoken in tokens_to_delete:
        del upload_tokens[utoken]
    
    return jsonify({"message": "Logged out successfully"})

# copied & modified from HTTP.server
def list_directory(path):
    """Helper to produce a directory listing (absent index.html).

    Return value is either a file object, or None (indicating an
    error).  In either case, the headers are sent, making the
    interface the same as for send_head().

    """
    try:
        list = os.listdir(path)
    except OSError as e:
        print("Error: ",e)
        return None
    list.sort(key=lambda a: a.lower())
    r = []
    for name in list:
        fullname = os.path.join(path, name)
        # Append / for directories or @ for symbolic links
        if os.path.isdir(fullname):
            name = name + "/"
        if os.path.islink(fullname):
            # not allowed to access symbolic links
            continue
        r.append(f"{quote(name, errors='surrogatepass')}")
    return r

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
