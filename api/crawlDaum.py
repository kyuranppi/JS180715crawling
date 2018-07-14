import requests
from bs4 import BeautifulSoup

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

week=["mon","tue","wed","thu","fri","sat","sun"]
url = "http://webtoon.daum.net/data/pc/webtoon/list_serialized/"

print("[")
for idx,day in enumerate(week):
    req=url+day;
    json=requests.get(req).json()['data']
    for list in json:
        print("{\"title\" : \""+list['title']+"\",")
        print("\"imgsrc\" : \""+list['pcThumbnailImage']['url']+"\",")
        print("\"day\" : "+str(idx)+"},")
