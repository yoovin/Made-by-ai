#!/usr/bin/env python3
import json, os, sys, urllib.request, uuid
BOT_TOKEN=os.getenv('TELEGRAM_BOT_TOKEN','')
CHAT_ID=os.getenv('TELEGRAM_CHAT_ID','')
if __name__=='__main__':
    if len(sys.argv)!=2: raise SystemExit(1)
    path=sys.argv[1]
    if not BOT_TOKEN or not CHAT_ID or not os.path.exists(path): raise SystemExit(0)
    boundary='----'+uuid.uuid4().hex
    with open(path,'rb') as f: data=f.read()
    name=os.path.basename(path)
    body=(f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{CHAT_ID}\r\n'.encode()+
          f'--{boundary}\r\nContent-Disposition: form-data; name="document"; filename="{name}"\r\nContent-Type: text/markdown\r\n\r\n'.encode()+data+b'\r\n'+
          f'--{boundary}--\r\n'.encode())
    req=urllib.request.Request(f'https://api.telegram.org/bot{BOT_TOKEN}/sendDocument',data=body,headers={'Content-Type':f'multipart/form-data; boundary={boundary}'},method='POST')
    with urllib.request.urlopen(req,timeout=30) as r: res=json.load(r)
    raise SystemExit(0 if res.get('ok') else 1)
