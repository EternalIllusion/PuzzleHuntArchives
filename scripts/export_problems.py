import os
import re
import yaml
import pymysql
import requests
from mysql_const import MYSQL_CONST,BASE_DIR


def read_from_db(sql):
    # 连接数据库
    dbconn = pymysql.connect(host=MYSQL_CONST['host'],
                             port=MYSQL_CONST['port'],
                             user=MYSQL_CONST['user'],
                             password=MYSQL_CONST['pass'],
                             db=MYSQL_CONST['db'], charset='utf8')
    
    cursor = dbconn.cursor()

    # 读取数据
    cursor.execute(sql)
    data = cursor.fetchall()
    cursor.close()
    dbconn.close()
    return data

def parse_problem(row):
    # 解析数据
    """CREATE TABLE `puzzle` (
  0`pid` int(11) NOT NULL COMMENT '题目ID',
  `pgid` int(11) NOT NULL COMMENT '题目组ID',
  2`desc` varchar(255) DEFAULT NULL COMMENT '描述（显示在列表区域）',
  `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '内容类型（0-图片 1-HTML 2-VUE SFC 3-上传模块）',
  4`title` varchar(255) DEFAULT NULL COMMENT '标题',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  6`extend_data` varchar(255) DEFAULT NULL COMMENT '附加数据',
  `content` text DEFAULT NULL COMMENT '题目描述',
  8`image` text DEFAULT NULL COMMENT '图片URL（type=0有效）',
  `html` longtext DEFAULT NULL COMMENT '题目HTML（type=1，2有效）',
  10`script` longtext DEFAULT NULL COMMENT '题目脚本（type=2有效）',
  `answer_type` tinyint(4) NOT NULL COMMENT '答案类型（0-小题 1-组/区域Meta 2-PreFinalMeta 3-FinalMeta 4-不计分题目）',
  12`answer` varchar(255) NOT NULL COMMENT '答案',
  `check_answer_type` int(11) DEFAULT NULL COMMENT '判题类型（0-标准判题函数 1-自定义判题函数）',
  14`check_answer_function` varchar(255) DEFAULT NULL COMMENT '判题函数名',
  `attempts_count` int(11) NOT NULL DEFAULT 20 COMMENT '初始允许尝试次数',
  16`jump_keyword` varchar(255) DEFAULT NULL COMMENT '隐藏题目跳转关键字',
  `extend_content` text DEFAULT NULL COMMENT '附加内容（正解后显示）',
  18`analysis` text DEFAULT NULL COMMENT '答案解析',
  `dt_update` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '上次修改时间',
"""
    problem = {}
    problem['pid'] = row[0]
    problem['pgid'] = row[1]
    problem['type'] = row[3]
    problem['title'] = row[4]
    problem['extend_data'] = row[6]
    problem['content'] = row[9]
    problem['image'] = row[8]
    problem['html'] = row[9]
    problem['answer_type'] = row[11]
    problem['answer'] = row[12]
    problem['jump_keyword'] = row[16]
    problem['extend_content'] = row[17]
    problem['desc'] = row[7]
    problem['attempts_count'] = row[15]
    problem['analysis'] = row[18]
    problem['script'] = row[10]
    problem['dt_update'] = row[19]

    return problem

def parse_puzzle_tips(row):
    #print(row)
    """  `ptid` int(11) NOT NULL AUTO_INCREMENT COMMENT '提示ID',
  `order` int(11) NOT NULL COMMENT '提示顺序',
  `pid` int(11) NOT NULL COMMENT '所属题目ID',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `content` text DEFAULT NULL COMMENT '内容',
  `desc` varchar(255) DEFAULT NULL COMMENT '备注',
  `point_cost` int(11) NOT NULL COMMENT '消耗能量点',
  `unlock_delay` double NOT NULL COMMENT '解锁延迟时间（单位：分钟）',"""
    puzzle_tips = {}
    puzzle_tips['ptid'] = row[0]
    puzzle_tips['pid'] = row[2]
    puzzle_tips['title'] = row[3]
    puzzle_tips['content'] = row[4]
    puzzle_tips['desc'] = row[5]
    puzzle_tips['point_cost'] = row[6]
    puzzle_tips['unlock_delay'] = row[7]
    puzzle_tips['order'] = row[1]

    return puzzle_tips

def parse_additional_answers(row):
    additional_answers = {}
    additional_answers['aaid'] = row[0]
    additional_answers['pid'] = row[1]
    additional_answers['answer'] = row[2]
    additional_answers['message'] = row[3]
    additional_answers['extra'] = row[4]

    return additional_answers

def download_image(image_url, image_path):
    # 下载图片到本地
    if not os.path.exists(image_path):
        os.makedirs(image_path)
    image_name = image_url.split('/')[-1]
    local_url = "/n2ph/images/%s/%s" % (image_path.split('\\')[-1], image_name)

    local_path = os.path.join(image_path, image_name)

    print("Downloading image %s" % image_url)
    #使用requests库下载图片
    response = requests.get(image_url)
    with open(local_path, 'wb') as f:
        f.write(response.content)
    return local_url

def get_download_images(content, image_path):
    return content.replace("https://static.n2ph.fun/images/","/n2ph/static/")
    # 提取所有 https://static.cipherpuzzles.com/static/...webp 的图片链接
    image_urls = re.findall(r'https://static.n2ph.fun/images/.*?(?:webp|m4a|mp4)', content)
    for image_url in image_urls:
        # 下载图片到本地
        local_url = download_image(image_url, image_path)
        # 替换图片链接为本地链接
        content = content.replace(image_url, local_url)
    return content

def get_path_area(problem):
    path_area_dict = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
    }
    path_area = path_area_dict[problem['pgid']]
    return path_area

def convert_problem(problem):
    path_area = get_path_area(problem)

    image_path = os.path.join(BASE_DIR, 'images', path_area)

    content = {}
    content['type'] = 'problem'
    content['title'] = "%s" % (problem['title'],)
    content['extend-data'] = problem['extend_data']
    content['content-type'] = problem['type'] # 0: image, 1: html 2: vue-sfc

    content['content'] = []
    if problem['content']:
        parsed_content = get_download_images(problem['content'], image_path)
        content['content'].append(parsed_content)

    if problem['type'] != 2:
        if problem['html']:
            parsed_html = get_download_images(problem['html'], image_path)
            content['content'].append(parsed_html)
    else:
        if problem['html']:
            parsed_html = get_download_images(problem['html'], image_path)
            content['vue_template'] = parsed_html
        if problem['script']:
            parsed_vue_script = get_download_images(problem['script'], image_path)
            content['vue_script'] = parsed_vue_script

    if problem['extend_content']:
        content['extend-content'] = []
        parsed_extend_content = get_download_images(problem['extend_content'], image_path)
        content['extend-content'].append(parsed_extend_content)

    if problem['image']:
        local_url = download_image(problem['image'], image_path)
        content['problem-image'] = local_url

    content['answer'] = problem['answer']
    content['desc'] = problem['desc']
    
    # 插入提示
    puzzle_tips = read_from_db('select * from `puzzle_tips` where `pid` = %s order by `order` asc' % problem['pid'])

    if puzzle_tips and len(puzzle_tips) > 0:
        puzzle_tips_list = []
        for tip_row in puzzle_tips:
            puzzle_tip = parse_puzzle_tips(tip_row)
            parse_tip_content = get_download_images(puzzle_tip['content'], image_path)
            puzzle_tips_list.append({
                'title': f"{puzzle_tip['title']} ({puzzle_tip["point_cost"]}提示点)",
                'content': parse_tip_content,
            })
        
        content['tips'] = puzzle_tips_list

    # 插入里程碑
    additional_answers = read_from_db('select * from `additional_answer` where `pid` = %s' % problem['pid'])

    if additional_answers and len(additional_answers) > 0:
        additional_answers_list = []
        for answer_row in additional_answers:
            additional_answer = parse_additional_answers(answer_row)
            additional_answers_list.append({
                'answer': additional_answer['answer'],
                'message': additional_answer['message'],
                'extra': additional_answer['extra'],
            })
        
        content['additional-answers'] = additional_answers_list
    
    if problem['analysis']:
        parse_analysis = get_download_images(problem['analysis'], image_path)
        content['answer-analysis'] = parse_analysis

    # 插入链接
    content['links'] = []
    content['links'].append({'title': '索引页', 'type': 'index', 'path': 'n2ph/index'})
    if problem['pgid'] == 1:
        content['links'].append({'title': '预热赛+正赛', 'type': 'page', 'path': 'n2ph/pages/a'})
    elif problem['pgid'] == 2:
        content['links'].append({'title': '正赛黑棋线', 'type': 'page', 'path': 'n2ph/pages/b'})
    elif problem['pgid'] == 3:
        content['links'].append({'title': '正赛白棋线', 'type': 'page', 'path': 'n2ph/pages/c'})
    elif problem['pgid'] == 4:
        content['links'].append({'title': '真Final Meta', 'type': 'page', 'path': 'n2ph/pages/d'})

    return content

def start():
    # 读取数据库
    data = read_from_db('select * from puzzle')
    # 写入文件
    for row in data:
        #print(row)
        problem = parse_problem(row)

        # 跳过前70题
        #if problem['pid'] < 71:
        #    continue


        print("Processing problem %s %s" % (problem['pid'], problem['title']))
        problem_doc = convert_problem(problem)

        path_area = get_path_area(problem)
        problem_path = os.path.join(BASE_DIR, 'problems', path_area)
        if not os.path.exists(problem_path):
            os.makedirs(problem_path)

        file_name = "%s" % problem['pid']
        
        problem_file = os.path.join(problem_path, "%s.yaml" % file_name)

        with open(problem_file, 'w', encoding='utf8') as f:
            yaml.dump(problem_doc, f, allow_unicode=True)

if __name__ == '__main__':
    start()