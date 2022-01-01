# Requirements:
* [Node.js 10.x](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* Python 2.6+ [PIP]
* [FFMPEG](https://www.ffmpeg.org/download.html)

# Installation
1. Run command below in root directory
	```sh
	npm install --production
	```
2. Install additional independent [Youtube-DL](https://github.com/rg3/youtube-dl) library:
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
Configuration path: /etc/nginx/sites-available/default
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
To test nginx configuration use command below:
```sh
sudo nginx -t
```

After every change of configuration you need to reload nginx:
```sh
service nginx reload
```
### Systemd:
We should use process managers to keep application alive and restart every time, when it crash for some reason.
We'll be using SystemD which is the default process manager in Linux distributions.

**Setup:**

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
Every time you change this service configuration, you should reload systemd units:
```sh
systemctl daemon-reload
```
**Commands:**
```sh
systemctl enable ytdl.service
systemctl start ytdl.service
systemctl status ytdl.service
```
**Viewing systemd logs:**

We've configured systemd above to write standard output and its error to syslog, so we should use command below:
```sh
cat /var/log/syslog
```

### IPTABLES
You can change default policy of INPUT to DROP:
```
iptables -A INPUT -j REJECT --reject-with icmp-port-unreachable
```
Block specific ports:
```
iptables -I INPUT -p udp  --dport 80 -j DROP
iptables -I INPUT -p udp  --dport 8080 -j DROP
iptables -I INPUT -p udp  --dport 3000 -j DROP
iptables -I INPUT -p tcp  --dport 80 -j DROP
iptables -I INPUT -p tcp  --dport 8080 -j DROP
iptables -I INPUT -p tcp  --dport 3000 -j DROP
```
Open for specific IP's:
```
iptables -I INPUT -p tcp -s [IP] --dport 80 -j ACCEPT
iptables -I INPUT -p tcp -s [IP] --dport 8080 -j ACCEPT
iptables -I INPUT -p tcp -s [IP] --dport 3000 -j ACCEPT
```