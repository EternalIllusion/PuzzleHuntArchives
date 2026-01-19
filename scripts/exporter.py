import os,sys
import json,pymysql
import re,requests
from datetime import datetime,timezone
from exporter_consts import MYSQL_CONST,BASE_DIR,PROJECT_NAME,STATIC_URL_PREFIX,FINAL_PUZZLE_PID,CONFIG_START_TIME,MANUAL_BYPASS_DOWNLOAD_FLAG
import hashlib

#工具函数

dbconn,dbcursor=None,None

def db_connect(MYSQL_CONST):
    global dbconn,dbcursor
    if dbcursor:return 404
    try:
        dbconn = pymysql.connect(host=MYSQL_CONST['host'],
                             port=MYSQL_CONST['port'],
                             user=MYSQL_CONST['user'],
                             password=MYSQL_CONST['pass'],
                             db=MYSQL_CONST['db'], charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor
                             )
        dbcursor = dbconn.cursor()
    except Exception as e:
        print(e,file=sys.stderr)
        return 500
    return 0

def db_disconnect():
    global dbconn,dbcursor
    if not dbcursor:return 404
    try:
        dbcursor.close()
        dbconn.close()
        dbconn,dbcursor=None,None
    except Exception as e:
        print(e,file=sys.stderr)
        return 500
    return 0

def db_exec(sql):
    global dbconn,dbcursor
    if not dbcursor:raise IOError('No available DB connection')
    try:
        dbcursor.execute(sql)
        data = dbcursor.fetchall()
        return data
    except Exception as e:
        print(e,filt=sys.stderr)
        return None
    
def ensure_dir_exists(path=BASE_DIR):
    if not os.path.exists(path):
        os.makedirs(path)

def convertto_timestamp(time):
    # 将输入的时间文本转换为时间戳
    if not time:
        return None
    try:
        dt = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
        return int(dt.timestamp() * 1000)
    except ValueError:
        return None

def get_avatar_hash(email: str) -> str:
    normalized_email = email.strip().lower()
    md5_hash = hashlib.md5(normalized_email.encode('utf-8')).hexdigest()
    return md5_hash
    
#导出主列表

def create_main_page(groups):
    """
    CREATE TABLE `puzzle` (
    `pid` int(11) NOT NULL COMMENT '题目ID',
    `pgid` int(11) NOT NULL COMMENT '题目组ID',
    `desc` varchar(255) DEFAULT NULL COMMENT '描述（显示在列表区域）',
    `type` tinyint(4) NOT NULL DEFAULT 0 COMMENT '内容类型（0-图片 1-HTML 2-VUE SFC 3-上传模块）',
    `title` varchar(255) DEFAULT NULL COMMENT '标题',
    `author` varchar(255) DEFAULT NULL COMMENT '作者',
    `extend_data` varchar(255) DEFAULT NULL COMMENT '附加数据',
    `content` text DEFAULT NULL COMMENT '题目描述',
    `image` text DEFAULT NULL COMMENT '图片URL（type=0有效）',
    `html` longtext DEFAULT NULL COMMENT '题目HTML（type=1，2有效）',
    `script` longtext DEFAULT NULL COMMENT '题目脚本（type=2有效）',
    `answer_type` tinyint(4) NOT NULL COMMENT '答案类型（0-小题 1-组/区域Meta 2-PreFinalMeta 3-FinalMeta 4-不计分题目）',
    `answer` varchar(255) NOT NULL COMMENT '答案',
    `check_answer_type` int(11) DEFAULT NULL COMMENT '判题类型（0-标准判题函数 1-自定义判题函数）',
    `check_answer_function` varchar(255) DEFAULT NULL COMMENT '判题函数名',
    `attempts_count` int(11) NOT NULL DEFAULT 20 COMMENT '初始允许尝试次数',
    `jump_keyword` varchar(255) DEFAULT NULL COMMENT '隐藏题目跳转关键字',
    `extend_content` text DEFAULT NULL COMMENT '附加内容（正解后显示）',
    `analysis` text DEFAULT NULL COMMENT '答案解析',
    `dt_update` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '上次修改时间',
    PRIMARY KEY (`pid`),
    KEY `Index_puzzle_pgid` (`pgid`)
    )
    """
    main_page = {
        'type': 'page',
        'title': f'{PROJECT_NAME} 首页',
        'content': f'{PROJECT_NAME} 分区列表',
        'links': [
            {
                'title': '返回首页',
                'type': 'index',
                'path': f'/main/{PROJECT_NAME}'
            }
        ]
    }
    for group in groups:
        pgid, pg_name = group['pgid'],group['pg_name']
        main_page['links'].append({
            'title': pg_name,
            'type': 'page',
            'path': f'/area/{PROJECT_NAME}/{pgid}'
        })
    return main_page

def create_main_index(groups):
    main_page = []
    for group in groups:
        pgid, pg_name = group['pgid'],group['pg_name']
        main_page.append({
            'title': pg_name,
            'path': f'/area/{PROJECT_NAME}/{pgid}',
            'pgid': pgid
        })
    return main_page

def create_group_page(pgid, pg_name, puzzles):
    group_page = {
        'title': f'{pg_name}',
        'problems': []
    }
    for puzzle in puzzles:
        group_page['problems'].append({
            'pid': puzzle["pid"],
            'title': puzzle["title"],
            'type': puzzle["answer_type"],
            'path': f'/problems/{PROJECT_NAME}/{pgid}/{puzzle["pid"]}'
        })
    return group_page

def create_gid_index(pgid, pg_name, puzzles):
    i={}
    for puzzle in puzzles:
        i[f'{puzzle["pid"]}']={
            'title': puzzle["title"],
            'type': puzzle["answer_type"],
            'path': f'/problems/{PROJECT_NAME}/{pgid}/{puzzle["pid"]}',
            'pid' : f'{puzzle["pid"]}',
            'pgid': f'{pgid}'
        }
    return i


def export_mainlist():
    ensure_dir_exists(os.path.join(BASE_DIR, 'area'))

    # 获取所有分区
    groups = db_exec('SELECT pgid, pg_name FROM puzzle_group')
    
    # 生成main.json
    print(f'Processing main puzzle list...')
    main_page = create_main_page(groups)
    main_page_meta = create_main_index(groups)
    puzzle_pid_index = {}
    
    # 为每个分区生成json文件
    for group in groups:
        pgid, pg_name = group['pgid'],group['pg_name']
        print(f'Processing puzzle list for pgid {pgid}...')
        puzzles = db_exec(f'SELECT pid, title, answer_type FROM puzzle WHERE pgid = {pgid}')
        group_page = create_group_page(pgid, pg_name, puzzles)
        puzzle_pid_index = {
            **puzzle_pid_index,
            **create_gid_index(pgid, pg_name, puzzles)
        }
        
        filename = f'{pgid}.json'
        with open(os.path.join(BASE_DIR, 'area', filename), 'w', encoding='utf8') as f:
            json.dump(group_page, f)
    with open(os.path.join(BASE_DIR, 'pids.json'), 'w', encoding='utf8') as f:
        json.dump(puzzle_pid_index, f)
    
    return main_page_meta

#导出公告

def create_announcement(announcement):
    """
    CREATE TABLE `announcement` (
    `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
    `update_time` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '更新时间',
    `create_time` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '创建时间',
    `content` text DEFAULT NULL COMMENT '公告内容',
    `is_hide` int(11) NOT NULL DEFAULT 0 COMMENT '是否隐藏（0-不隐藏 1-隐藏）',
    PRIMARY KEY (`aid`)
    )
    """
    # 转换公告格式
    content = {}
    content['aid'] = announcement['aid']
    content['content'] = announcement['content']
    content['create_time'] = convertto_timestamp(announcement['create_time'].strftime('%Y-%m-%d %H:%M:%S') if announcement['content'] else None)
    content['update_time'] = convertto_timestamp(announcement['update_time'].strftime('%Y-%m-%d %H:%M:%S') if announcement['content'] else None)
    return content

def export_announcement():
    # 读取数据库
    data = db_exec('select * from announcement order by create_time asc')
    announcements_doc = {
        'type': 'announcements',
        'title': f'公告存档 - {PROJECT_NAME.upper()}',
        'content': f"这是{PROJECT_NAME.upper()}比赛期间的公告存档。"
    }
    announcements = []
    for row in data:
        announcement = create_announcement(row)
        print(f"Processing announcement {announcement['aid']} ...")
        announcements.append(announcement)

    announcements_doc['announcements'] = announcements

    # 写入文件
    output_file = os.path.join(BASE_DIR, 'announcements.json')
    with open(output_file, 'w', encoding='utf8') as f:
        json.dump(announcements_doc, f)

#导出题目

def create_problem(problem,mainlist):
    content = {}
    content['type'] = 'problem'
    content['title'] = "%s" % (problem['title'],)
    content['extendData'] = problem['extend_data']
    content['contentType'] = problem['type'] # 0: image, 1: html 2: vue-sfc

    content['content'] = ""

    if problem['type'] == 1:
        if problem['html']:
            content['content'] = handle_static(problem['html'])
    elif problem['type'] == 2:
        if problem['html']:
            parsed_html = handle_static(problem['html'])
            content['vueTemplate'] = parsed_html
        if problem['script']:
            parsed_vue_script = handle_static(problem['script'])
            content['vueScript'] = parsed_vue_script
    elif problem['type'] == 3:
        content['vueScript'] = handle_static(problem['script'])


    if problem['extend_content']:
        content['extendContent'] = handle_static(problem['extend_content'])

    if problem['image']:
        local_url = handle_static(problem['image'], True)
        content['problemImage'] = local_url

    content['answer'] = problem['answer']
    if int(problem['check_answer_type'])>0:content['answer'] = f'%BACKEND_SCRIPT%{problem["check_answer_function"] if problem["check_answer_function"] else ""}'
    content['desc'] = problem['content']
    #print(problem['content'],"💡" in problem['content'])

    """
    CREATE TABLE `puzzle_tips` (
    `ptid` int(11) NOT NULL AUTO_INCREMENT COMMENT '提示ID',
    `order` int(11) NOT NULL COMMENT '提示顺序',
    `pid` int(11) NOT NULL COMMENT '所属题目ID',
    `title` varchar(255) NOT NULL COMMENT '标题',
    `content` text DEFAULT NULL COMMENT '内容',
    `desc` varchar(255) DEFAULT NULL COMMENT '备注',
    `point_cost` int(11) NOT NULL COMMENT '消耗能量点',
    `unlock_delay` double NOT NULL COMMENT '解锁延迟时间（单位：分钟）',
    PRIMARY KEY (`ptid`),
    KEY `Index_puzzle_tips_pid` (`pid`)
    )
    """

    # 插入提示
    puzzle_tips = db_exec('select * from `puzzle_tips` where `pid` = %s order by `order` asc' % problem['pid'])

    if puzzle_tips and len(puzzle_tips) > 0:
        puzzle_tips_list = []
        for tip_row in puzzle_tips:
            puzzle_tip = tip_row
            parse_tip_content = handle_static(puzzle_tip['content'])
            puzzle_tips_list.append({
                'title': f"{puzzle_tip['title']} ({puzzle_tip["point_cost"]}提示点)",
                'content': parse_tip_content,
            })
        
        content['tips'] = puzzle_tips_list

    # 插入里程碑
    additional_answers = db_exec('select * from `additional_answer` where `pid` = %s' % problem['pid'])

    if additional_answers and len(additional_answers) > 0:
        additional_answers_list = []
        for answer_row in additional_answers:
            additional_answer = answer_row
            additional_answers_list.append({
                'answer': additional_answer['answer'],
                'message': additional_answer['message'],
                'extra': additional_answer['extra'],
            })
        
        content['additionalAnswers'] = additional_answers_list
    
    if problem['analysis']:
        parse_analysis = handle_static(problem['analysis'])
        content['answerAnalysis'] = parse_analysis

    # 插入链接
    content['links'] = []
    content['links'].append({'title': '索引页', 'type': 'index', 'path': 'n2ph/index'})
    al = [i for i in mainlist if i.get("pgid") == problem["pgid"]]
    content['links'].extend(al)
    content['arealink'] = al[0]

    return content

def handle_static(content,isurl=False):
    # 提取所有static链接
    image_urls = []
    if not isurl:
        image_urls = re.findall(re.escape(STATIC_URL_PREFIX)+r'''[^\"'\s()<>]*\.[a-zA-Z0-9]{1,4}''', content)
        name_start = len(STATIC_URL_PREFIX)
        image_path = os.path.join(BASE_DIR, 'static')
        ensure_dir_exists(image_path)
        image_urls = list(set(image_urls)) #去重
    else:
        image_urls = [content]

    for image_url in image_urls:
        image_name = image_url[name_start:]
        print(f'Downloading asset {image_name} ...')
        local_url = f"/config/{PROJECT_NAME}/static/{image_name}"
        local_path = os.path.join(image_path, image_name)
        ensure_dir_exists(os.path.dirname(local_path))
        if(os.path.exists(local_path) or MANUAL_BYPASS_DOWNLOAD_FLAG):
            print("----Already downloaded.Skipping...")
            content = content.replace(image_url, local_url)
            continue
        print(f"----Requesting url {image_url}")

        #使用requests库下载图片
        try:
            response = requests.get(image_url)
            with open(local_path, 'wb') as f:
                f.write(response.content)
            content = content.replace(image_url, local_url)
        except Exception as e:
            print(f"----Failed with exception:{e}",file=sys.stderr)
    return content
    

def export_puzzles(mainlist):
    # 读取数据库
    data = db_exec('select * from puzzle')
    for row in data:
        #print(row)
        print(f"Processing problem {row['pid']} {row['title']}...")

        problem = create_problem(row,mainlist)


        problem_path = os.path.join(BASE_DIR, 'problems', f"{row['pgid']}")
        if not os.path.exists(problem_path):
            os.makedirs(problem_path)

        file_name = f"{row['pid']}"
        
        problem_file = os.path.join(problem_path, "%s.json" % file_name)

        with open(problem_file, 'w', encoding='utf8') as f:
            json.dump(problem, f)

#导出题目脚本

def create_puzzle_page(item):
    puzzle_page = {
        'title': item["desc"],
        'type': 'backend_script',
        'psid': item["psid"],
        'key': item["key"],
        'content': [f'服务器脚本 {item["key"]} {item["desc"]}'],
        'script': f'./{item["key"]}/js'
    }
    
    return puzzle_page

def export_scripts():
    ensure_dir_exists(os.path.join(BASE_DIR, "scripts"))
    
    # 获取所有脚本
    scripts = db_exec('SELECT `psid`, `key`, `desc`, `script` FROM puzzle_backend_script')
    puzzle_page = []
    
    # 为每个脚本生成json文件
    for scriptItem in scripts:
        print(f"Processing script {scriptItem["key"]} ...")
        puzzle_page.append(create_puzzle_page(scriptItem))
        
        filename = f'{scriptItem["key"]}.js'
        with open(os.path.join(BASE_DIR, 'scripts', filename), 'w', encoding='utf8') as f:
            f.write(scriptItem["script"])
    
    with open(os.path.join(BASE_DIR, 'scripts', 'index.json'), 'w', encoding='utf8') as f:
        json.dump(puzzle_page,f)

#导出排行榜


def export_scoreboard():
    print("Processing scoreboard...")
    groups = db_exec("SELECT gid, groupname, profile FROM user_group WHERE is_hide != 1")

    # 2. 获取队伍成员（左连接 user）
    group_users = db_exec("""
        SELECT b.gid, b.is_leader, u.username, u.email, u.theme_color
        FROM user_group_bind b
        LEFT JOIN user u ON b.uid = u.uid
    """)

    # 构建 group -> users 映射
    from collections import defaultdict
    group_user_dict = defaultdict(list)
    for gu in group_users:
        if gu['email'] is None:
            continue  # 跳过无效用户
        group_user_dict[gu['gid']].append({
            'is_leader': gu['is_leader'],
            'username': gu['username'],
            'avatar': get_avatar_hash(gu['email']),
            'theme_color': gu['theme_color']
        })

    # 3. 获取 progress 数据
    progresses = db_exec("SELECT gid, data, is_finish, finish_time FROM progress")
    progress_dict = {}
    for p in progresses:
        try:
            data = json.loads(p['data'])
        except:
            data = {'FinishedGroups': [], 'FinishedProblems': []}
        progress_dict[p['gid']] = {
            'data': data,
            'is_finish': p['is_finish'],
            'finish_time': p['finish_time']
        }

    # 4. 构建 scoreboard items
    scoreboard_items = []
    for g in groups:
        gid = g['gid']
        item = {
            'gid': gid,
            'groupName': g['groupname'],
            'groupProfile': g['profile'] or '',
            'users': group_user_dict[gid],
            'isFinish': 0,
            'totalTime': -1,
            'finishedGroupCount': 0,
            'finishedPuzzleCount': 0
        }

        if gid in progress_dict:
            prog = progress_dict[gid]
            data = prog['data']
            finished_groups = data.get('FinishedGroups', [])
            finished_problems = data.get('FinishedProblems', [])

            # 判断是否完成最终题
            final_finish = 1 if FINAL_PUZZLE_PID in finished_problems else 0

            a = len(finished_groups) + final_finish
            b = len(finished_problems)

            item['finishedGroupCount'] = a
            item['finishedPuzzleCount'] = b
            item['isFinish'] = prog['is_finish']

            if prog['is_finish'] == 1 and prog['finish_time']:
                finish_dt = prog['finish_time']
                if isinstance(finish_dt, str):
                    finish_dt = datetime.fromisoformat(finish_dt.replace('Z', '+00:00'))
                start_dt = datetime.fromtimestamp(CONFIG_START_TIME, tz=timezone.utc)
                if finish_dt.tzinfo is None:
                    finish_dt = finish_dt.replace(tzinfo=timezone.utc)
                delta = (finish_dt - start_dt).total_seconds()
                item['totalTime'] = delta / 3600.0

        scoreboard_items.append(item)

    # 5. 分割 finished 和 unfinished
    finished = [x for x in scoreboard_items if x['isFinish'] == 1]
    unfinished = [x for x in scoreboard_items if x['isFinish'] != 1]

    # 排序
    finished.sort(key=lambda x: (x['totalTime'], x['gid']))
    unfinished.sort(key=lambda x: (-x['finishedGroupCount'], -x['finishedPuzzleCount'], x['gid']))

    # 构建 json 结构
    scoreboard_json = {
        'type': 'scoreboard',
        'title': f'排行榜 - {PROJECT_NAME}',
        'content': f"【存档版说明】\n\n此处显示的是{PROJECT_NAME}比赛的最终结果。排名规则不是按照得分排序的。",
        'scoreboarddata': {
            'finished_groups': finished,
            'groups': unfinished
        }
    }

    # 写入文件
    ensure_dir_exists(BASE_DIR)
    output_path = os.path.join(BASE_DIR, 'scoreboard.json')
    with open(output_path, 'w', encoding='utf8') as f:
        json.dump(scoreboard_json, f)

#导出剧情

def create_puzzle_article(item,links):
    """
    CREATE TABLE `puzzle_article` (
    `paid` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章ID',
    `key` varchar(255) NOT NULL COMMENT '索引名称',
    `title` varchar(255) NOT NULL COMMENT '文章标题',
    `content` text NOT NULL COMMENT '文章内容',
    `dt_create` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '发表时间',
    `dt_update` datetime(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000' COMMENT '更新时间',
    `is_hide` tinyint(4) NOT NULL DEFAULT 0 COMMENT '是否隐藏',
    PRIMARY KEY (`paid`),
    UNIQUE KEY `Index_puzzle_article_key_Unique` (`key`)
    ) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    puzzle_page = {
        'type': 'article',
        'title': item["title"],
        'content': f'{item["content"]}'
    }
    
    return puzzle_page

def export_articles():
    ensure_dir_exists(os.path.join(BASE_DIR, "articles"))
    
    # 获取所有脚本
    articles = db_exec('SELECT `paid`, `key`, `title`, `content` FROM puzzle_article')
    articlesb = articles
    links = []
    
    for item in articlesb:
        links.append(
            {
                'title': item['title'],
                'type': 'page',
                'path': f'/article/{PROJECT_NAME}/{item['key']}'
            },
        )

    
    # 为每个脚本生成json文件
    for item in articles:
        print(f"Processing article {item["key"]} ...")
        puzzle_page = create_puzzle_article(item,links)
        
        filename = f'{item["key"]}.json'
        with open(os.path.join(BASE_DIR, 'articles', filename), 'w', encoding='utf8') as f:
            json.dump(puzzle_page, f)
    article_index = {
        'type': 'page',
        'title': '剧情',
        'content': f'此处显示的是{PROJECT_NAME}的所有剧情。您也可以使用左下导航工具打开剧情目录。',
        'links': links
    }
    with open(os.path.join(BASE_DIR, 'articles', 'index.json'), 'w', encoding='utf8') as f:
        json.dump(article_index, f)

def gen_meta(main_index):
    data = {
            'type': 'index',
            'title': f'{PROJECT_NAME}存档站',
            'content': f'所有的题目均已存档，请点击主页面按钮查看。',
            'navs': [
                {
                    'title': '首页',
                    'type': 'index',
                    'path': f'/index'
                },
                {
                    'title': f'{PROJECT_NAME} 主页',
                    'type': 'page',
                    'path': f'/main/{PROJECT_NAME}'
                }
                ],
            'links': [
                *mainlist,
                {
                    'title': '剧情',
                    'type': 'page',
                    'path': f'/articles/{PROJECT_NAME}/index'
                },
                {
                    'title': '排行榜',
                    'type': 'scoreboard',
                    'path': f'/scoreboard/{PROJECT_NAME}'
                },
                {
                    'title': '公告列表',
                    'type': 'announcements',
                    'path': f'/announcements/{PROJECT_NAME}'
                },
            ]
        }
    with open(os.path.join(BASE_DIR, 'index.json'), 'w', encoding='utf8') as f:
        json.dump(data, f)

if __name__ == '__main__':
    import traceback

    print("==CCXC Archive Exporter==")
    print("==For PHArchive-Evolved==")
    print("by EterIll ph.eterill.xyz")
    print("=========================\n\n")
    #初始化
    ensure_dir_exists()
    print("Connectiing to Database...")
    db_connect(MYSQL_CONST)
    mainlist=None

    #导出公告
    try:export_announcement()
    except Exception as e:traceback.print_exc(file=sys.stderr)

    #导出主列表
    try:mainlist = export_mainlist()
    except Exception as e:traceback.print_exc(file=sys.stderr)

    #print(mainlist)
    #导出题目
    try:export_puzzles(mainlist)
    except Exception as e:traceback.print_exc(file=sys.stderr)

    #导出后端题目脚本
    try:export_scripts()
    except Exception as e:traceback.print_exc(file=sys.stderr)

    #导出排行榜
    try:export_scoreboard()
    except Exception as e:traceback.print_exc(file=sys.stderr)
    
    #导出剧情
    try:export_articles()
    except Exception as e:traceback.print_exc(file=sys.stderr)

    #建立索引
    print("Generating index.json")
    try:gen_meta(mainlist)
    except Exception as e:traceback.print_exc(file=sys.stderr)

    db_disconnect()
    print("Database disconnected.")
    print("=====\nExport complete.")