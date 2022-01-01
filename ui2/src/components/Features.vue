<template>
	<section class="features">
		<div class="container">
			<div class="row">
				<div class="col-4 fe">
					<div class="fas fa-hand-holding-usd icon"></div>
					<div class="head">Free</div>
					<div class="description">Vconv jest i zawsze będzie darmowy, nie ograniczamy żadnych funkcji dla użytkowników.</div>
				</div>
				<div class="col-4 fe">
					<div class="fas fa-shield-alt icon"></div>
					<div class="head">Safe</div>
					<div class="description">Nie musisz instalować niepotrzebnego oprogramowania na swoim komputerze, dzięki czemu możesz uwolnić się od Spyware lub Adware.</div>
				</div>
				<div class="col-4 fe">
					<div class="fas fa-medal icon"></div>
					<div class="head">Highest Quality</div>
					<div class="description">Zawsze konwertujemy pliki z najwyższej dostępnej jakości jaką oferuje dany serwis.</div>
				</div>
			</div>
			<div class="row">
				<div class="col-12 fe">
					<div class="fas fa-desktop icon"></div>
					<div class="head">All Platforms</div>
					<div class="description">Wspieramy każdą przeglądarkę i każdy system.</div>
				</div>
			</div>
		</div>
	</section>	
</template>

<style>
.features {
	position: relative;
	background: rgb(230, 230, 230);
	height: auto;
	padding: 15px 0;
}

.fe {
	position: relative;
	padding: 25px;
	text-align: center;
}

.fe .icon {
	font-size: 3rem;
}

.head {
	padding: 20px 0 15px 0;
	font-size: 1.1rem;
	font-weight: bold;
}

.description {
	font-size: .8rem;
	left: 100%;
	top: 0;
}
</style>
