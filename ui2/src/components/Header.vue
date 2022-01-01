<template>
	<header class="header">
		<div class="container">
			<div class="logoText"><span class="text">VCONV</span><span class="logoDescription">v0.1</span></div>
			<ul class="headerLinks">
				<li><a href="/">Home</a></li>
				<li><a href="#">FAQ</a></li>
				<li><a href="#">About</a></li>
			</ul>
		</div>
	</header>
</template>

<style scoped>
.header {
	background: linear-gradient(135deg, rgba(50,48,75,1) 0%,rgba(50,68,74,1) 22%,rgba(50,68,74,1) 33%,rgba(50,68,74,1) 42%,rgba(41,58,70,1) 58%,rgba(41,58,70,1) 67%,rgba(33,51,74,1) 100%);
	position: relative;
	width: 100%;
	top: 0;
	height: 58px;
	color: #fff;
	overflow: hidden;
	z-index: 10;
	border-bottom: 1px solid rgba(255,255,255,0.05);
}

.header .logoText {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	float: left;
	font-size: 18px;
	margin-right: 10px;
	padding-right: 10px;
	font-weight: bold;
	height: 58px;
	user-select: none;
}

.logoText .text {
	font-family: 'scriptina_pro';
	font-size: 18px;
	transform: rotate(-10deg);
}
@font-face {
	font-family: 'scriptina_pro';
	src: url('../webfonts/scriptina_pro.otf?of8hsm') format('opentype');
}

.header .logoDescription {
	position: absolute;
	display: block;
	font-size: 10px;
	padding: 2px 0;
	bottom: 5px;
	right: 5px;
	color: rgba(255, 255, 255, 0.5);
}

.header .headerLinks {
	float: left;
	position: relative;
	height: 100%;
}

.header .headerLinks li {
	position: relative;
	float: left;
}

.header .headerLinks li a {
	position: relative;
	color: rgb(219, 219, 219);
	padding: 20px 16px;
	line-height: 58px;
	font-size: 15px;
}

.header .headerLinks li a:after,
.header .headerLinks li a:before {
	content: "";
	position: absolute;
	width: calc(100% - 2px);
	background-color: none;
	left: 0;
	right: 0;
	height: 0;
	border: 1px solid rgba(255, 255, 255, 0.02);
	border-top: 0;
	border-bottom: 0;
	transition: height .2s, background-color .6s;
	transition-timing-function: cubic-bezier(.45,.05,.55,.95);
}

.header .headerLinks li a:before {
	top: 0;
}

.header .headerLinks li a:after {
	bottom: 0;
}

.header .headerLinks li a:hover:after,
.header .headerLinks li a:hover:before {
	background-color: rgba(255,255,255,0.02);
	height: 29px;
}

.header .headerLinks li a:hover {
	position: relative;
	top: 50%;
	bottom: 50%;
	height: 0;
	text-decoration: none;
	color: #fff;
}
</style>
