<template>
	<section class="main">
		<div class="mainForm">
			<div class="container">
				<div class="welcomePromo">Download videos from popular services and convert to your format with best quality!</div>
				<DownloadForm />
			</div>
		</div>
		<DownloadSites />
	</section>
</template>

<script>
import DownloadForm from './DownloadForm.vue';
import DownloadSites from './DownloadSites.vue';

export default {
  name: 'IDownload',
  components: {
		DownloadForm,
		DownloadSites
  }
}
</script>

<style scoped>
.main {
	position: relative;
	background: linear-gradient(0deg, rgba(26, 40, 56, 0.93), rgba(43, 58, 66, 0.93)), url('../assets/background.jpg') no-repeat center bottom fixed;
	height: auto;
	color: #fff;
	z-index: 1;
}

.main .mainForm {
	position: relative;
	padding-top: 40px;
}

.main .welcomePromo {
	font-size: 1.4rem;
	font-weight: bold;
}
</style>
