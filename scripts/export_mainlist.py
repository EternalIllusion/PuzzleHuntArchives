import os
import yaml
import pymysql
from mysql_const import MYSQL_CONST,BASE_DIR

PATH_MAPPING = {
    1: 'a',
    2: 'b', 
    3: 'c',
    4: 'd',
}


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

def create_main_page(groups):
    main_page = {
        'type': 'page',
        'title': 'n2ph 首页',
        'content': ['n2ph 分区列表'],
        'links': [
            {
                'title': '返回首页',
                'type': 'index',
                'path': 'n2ph/index'
            }
        ]
    }
    
    for group in groups:
        pgid, pg_name = group
        main_page['links'].append({
            'title': pg_name,
            'type': 'page',
            'path': f'n2ph/pages/{PATH_MAPPING[pgid]}'
        })
    
    return main_page

def create_group_page(pgid, pg_name, puzzles):
    group_page = {
        'type': 'page',
        'title': f'{pg_name}',
        'content': [f'{pg_name} 题目列表'],
        'links': [
            {
                'title': '返回索引页',
                'type': 'page',
                'path': 'n2ph/pages/main'
            }
        ]
    }
    
    for puzzle in puzzles:
        pid, title = puzzle
        group_page['links'].append({
            'title': title,
            'type': 'problem',
            'path': f'n2ph/problems/{pgid}/{pid}'
        })
    
    return group_page

def ensure_dir_exists():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

def export_mainlist():
    ensure_dir_exists()
    
    # 获取所有分区
    groups = read_from_db('SELECT pgid, pg_name FROM puzzle_group')
    
    # 生成main.yaml
    main_page = create_main_page(groups)
    with open(os.path.join(BASE_DIR, 'pages', 'main.yaml'), 'w', encoding='utf8') as f:
        yaml.dump(main_page, f, allow_unicode=True)
    
    # 为每个分区生成YAML文件
    for group in groups:
        pgid, pg_name = group
        puzzles = read_from_db(f'SELECT pid, title FROM puzzle WHERE pgid = {pgid}')
        group_page = create_group_page(pgid, pg_name, puzzles)
        
        filename = f'{PATH_MAPPING[pgid]}.yaml'
        with open(os.path.join(BASE_DIR, 'pages', filename), 'w', encoding='utf8') as f:
            yaml.dump(group_page, f, allow_unicode=True)

if __name__ == '__main__':
    export_mainlist()
