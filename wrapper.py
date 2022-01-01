from __future__ import unicode_literals
import sys
import youtube_dl
import math

def my_hook(d):
  if d['status'] == 'downloading':
    perc = math.ceil(float(d["_percent_str"].strip().replace("%", "")))
    msg = d["status"] + "," + str(d["downloaded_bytes"]) + "," + str(d["total_bytes"]) + "," + str(perc) + "," + str(d["_speed_str"].strip()) + ",PHOOK"
    print(msg)
  if d['status'] == 'finished' or d['status'] == 'error':
    msg = d["status"] + ",PHOOK"
    print(msg)

ydl_opts = {
  'format': 'bestaudio[ext=m4a]',
  'cachedir': False,
  'quiet': True,
  'forceduration': True,
  'outtmpl': 'cache/%(id)s.%(ext)s',
  'progress_hooks': [my_hook]
}

if __name__ == '__main__':
  with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([sys.argv[1]])
