<template>
  <div id="app">
		<Header />
		<Download />
		<Features />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Download from './components/Download.vue';
import Features from './components/Features.vue';

export default {
  name: 'app',
  components: {
		Header,
		Download,
		Features
  }
}
</script>

<style>
@import '~normalize.css';
@import 'css/grid.css';
@import 'css/fontawesome.css';
@import 'css/mia.css';

html {
	box-sizing: border-box;
}

*, ::before, ::after {
	box-sizing: inherit;
}

::selection {
	background: rgba(255,255,255,0.1);
}

:focus {
	outline: 0;
}

button, ::-moz-focus-inner {
	border: 0;
}

body {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
	background: #fff;
  color: #3f3f3f;
}

a {
	color: #424242;
	text-decoration: none;
}

a:hover {
	text-decoration: none;
	color: #5b5b5b;
}

a:visited, a:active {
	color: #424242;
}

a:hover {
	text-decoration: underline;
}

ul, li {
	list-style: none;
	margin: 0;
	padding: 0;
}

.commonBox {
	position: relative;
}

.commonBox .boxTitle {
	background: #4D3D3F;
	padding: 10px 15px;
	font-size: .95rem;
	color: #fff;
}

.commonBox .boxContent {
	border: 1px solid #4D3D3F;
}
</style>
