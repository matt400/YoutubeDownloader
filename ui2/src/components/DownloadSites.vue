<template>
	<div class="supportedSites">
		<div class="sites">
			<div class="site" v-for="(site, index) in listOfSites" :key="index"><a :href="site.link" target="_blank" rel="noopener noreferrer"><span :class="site.iconClass"></span></a></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'IDownloadSites',
	data() {
		return {
			listOfSites: [
				{ iconClass: "fab fa-youtube", link: "https://youtube.com" },
				{ iconClass: "fab fa-twitch", link: "https://twitch.tv" },
				{ iconClass: "fab fa-vimeo", link: "https://vimeo.com" },
				{ iconClass: "mab ma-dailymotion", link: "https://dailymotion.com" },
				{ iconClass: "mab ma-liveleak", link: "https://liveleak.com" },
				{ iconClass: "fab fa-soundcloud", link: "https://soundcloud.com" },
			]
		}
	}
}
</script>

<style scoped>
.supportedSites {
	width: 100%;
	position: relative;
	border-top: 1px solid rgba(56, 78, 90, 0.3);
	text-align: center;
	margin-top: 15px;
	padding: 8px 0;
}

.supportedSites .sites {
	position: relative;
	display: flex;
	justify-content: center;
}

.supportedSites .site {
	margin: 0 10px;
}

.supportedSites .site a {
	color: rgba(255, 255, 255, 0.1);
	font-size: 1.8rem;
	transition: color .5s;
}

.supportedSites .site a:hover {
	color: rgba(250, 250, 250, 0.8);
}
</style>
