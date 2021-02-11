import time

import requests
from bs4 import BeautifulSoup

start_page = 51
stop_page = 100
bbs_url = 'https://bbs.pku.edu.cn/v2/'
base_url = 'https://bbs.pku.edu.cn/v2/thread.php?bid=3&mode=topic&page='
keyword = '申请人数'
date_keyword = '本日新增人口统计'
register_keyword = '本日申请新帐号人数'
verbose = True

result = []
fout = open('save.txt', 'w')
for i in range(start_page, 1+stop_page):
    time.sleep(0.5)
    print('crawling page %d' % i)
    board_url = base_url + str(i)
    response = requests.get(board_url)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')

    for item in soup.find_all('div', class_='list-item-topic list-item'):
        if keyword in item.text:
            href_label = item.find_all('a')[0]
            thread_url = bbs_url + href_label.get('href')

            def extract_register_number(url):
                response = requests.get(url)
                html = response.text

                soup = BeautifulSoup(html, 'html.parser')
                text = soup.text

                date = ''
                number = ''
                for t in text.split():
                    if date_keyword in t:
                        # 都是20xx年
                        date = t[t.index('2'):]
                    if register_keyword in t:
                        number = t[t.index('：')+1:]
                return (date, number)
            
            date, number = extract_register_number(thread_url)
            result.append((date, number))
            if verbose:
                print(date, number)
            fout.write(date + '\t' + number + '\n')
fout.close()

