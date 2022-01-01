# Description
This is a simple WebUI for Youtube-DL library. I've tried to learn Vue.JS

# Requirements:
* [Node.js 10.x](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Vue.JS 2.x
* Python 2.6+
* [FFMPEG](https://www.ffmpeg.org/download.html)
* [Youtube-DL](https://github.com/ytdl-org/youtube-dl)

# Installation
Run command below in root directory
```sh
npm install --production
```
And install [Youtube-DL](https://github.com/rg3/youtube-dl) library:
```sh
sudo pip install --upgrade youtube_dl
```

# Building a project:
To build everything for production, you need to build UI first. Run command below from UI directory:
```
npm run-script build
```
Then go to the root path and execute:
```
gulp
```

# Server configuration:
### NGINX:
File path: /etc/nginx/sites-available/default
```
server {
	listen 80 default_server;

	server_name ytdl;

	location / {
		proxy_pass http://localhost:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
```

### Systemd configuration:
Service path: /etc/systemd/system/ytdl.service
```
[Unit]
Description=Youtube Downloader

[Service]
ExecStart=/usr/bin/node /home/ome/ytdl/server/index.js
WorkingDirectory=/home/ome/ytdl/server
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=YTDL
# Change to a non-root user (optional, but recommended)
User=ome
Group=ome
# Set environment options
Environment=NODE_ENV=production PORT=3000

[Install]
WantedBy=multi-user.target
```
