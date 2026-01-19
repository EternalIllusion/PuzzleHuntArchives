# CCXCArchiveEvolved

基于 CCXC-Puzzle & CCBCArchive 开发的全新存档站。支持Cloudflare Pages、Vercel、Github Pages等自动化构建。

启动：`npm run dev`

构建：`npm run build`

TODO：    
- [x] 题目脚本    
- [ ] 主题自定义
- [ ] 判题脚本    
- [ ] 答案extra属性（我还没研究过）    

## 自动化存档

本项目含有自动化归档程序。下面是使用教程。

首先，我们强烈建议您备份数据库（比赛结束的时候就立即阻断api同时备份，防止后续递交产生影响）

```bash
# 数据库root免输密码，如果你用的是我的部署教程可以直接用
mysqldump -u root ccxc_prod > ccxc_prod_backup_$(date +%Y%m%d).sql

# 数据库root用户密码登陆方式，需要输入密码
mysqldump -u root -p ccxc_prod > ccxc_prod_backup_$(date +%Y%m%d).sql

# 数据库ccxc用户密码登陆方式，需要输入ccxc后端config里配置的密码
mysqldump -u ccxc_user -p ccxc_prod > ccxc_prod_backup_$(date +%Y%m%d).sql
```

尽管服务器上也能运行导出脚本，我们仍然建议您在自己的工作站上搭建mariadb并且恢复备份。

```bash
mysql -u root -p ccxc_prod < ccxc_prod_backup_xxxxxxxx.sql
```

接下来，请编辑`/scripts/exporter_consts.py`里的配置：

```python
# 比赛的显示名称，例如ccbc 16
PROJECT_NAME = "test" 

# 数据库的连接信息，请根据实际情况修改
MYSQL_CONST = { 
    'host': 'localhost',
    'port': 3306,
    'user': 'archiver',
    'pass': 'password',
    'db': 'ccxc_prod',
}

# 存档文件夹存放到的位置，可以不存在，但是建议提前新建以防出现问题
BASE_DIR = f"D:\\Projects\\PHArchiveRevolved\\public\\config\\{PROJECT_NAME}" 

# 设置为真来跳过所有下载步骤（您可以稍后手动拷贝服务器的static存放文件夹）
MANUAL_BYPASS_DOWNLOAD_FLAG = False

# 服务器前端static的url的前缀，要求能访问到
STATIC_URL_PREFIX = "https://static.example.com/images/"

# Final meta的pid，详见题目管理部分
FINAL_PUZZLE_PID = 64

# 比赛开始的时间戳，在system_options表里的StartTime,记得除以1000
CONFIG_START_TIME = 1766246400000 // 1000
```

然后请您运行exporter.py:

```bash
pip3 install -r requirements
python3 ./scripts/exporter.py
```

大功告成！脚本已经为您完成了大部分重复工作，您只需手动完成修改和主题定制！