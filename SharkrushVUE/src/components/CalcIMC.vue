<template>
	<nav class="main-menu">
		<div class="logo-container">
			<img src="../components/midia/logoshark.png" alt="Logo" />
		</div>
		<ul>
			<li>
				<a href="#" :class="{ active: activeNav === 'calculadora-imc' }" @click.prevent="goTo('calculadora-imc')">
					<i class="fa fa-calculator nav-icon"></i>
					<span class="nav-text">Calculadora IMC</span>
				</a>
			</li>
			<li>
				<a href="#" :class="{ active: activeNav === 'calculadora-kalorias' }" @click.prevent="goTo('calculadora-kalorias')">
					<i class="fa fa-fire nav-icon"></i>
					<span class="nav-text">Calculadora Kalorias</span>
				</a>
			</li>
			
		</ul>
	</nav>

	<div class="background-animation">
		<div class="shark-fin" style="top: 20%; animation-delay: 0s;"></div>
		<div class="shark-fin" style="top: 60%; animation-delay: 3s;"></div>
		<div class="shark-fin" style="top: 40%; animation-delay: 6s;"></div>
	</div>

	<div class="container">
		<h2 class="page-title">Calculadora IMC</h2>
		<div class="calculator-card">
			<form @submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="weight">Peso (kg)</label>
					<div class="input-container">
						<input type="number" id="weight" step="0.1" min="1" max="500" placeholder="Ex: 70.5" v-model.number="weight" @input="clearError('weight')" required>
						<span class="input-icon">⚖️</span>
					</div>
					<div class="error-message" v-show="weightError">{{ weightError }}</div>
				</div>

				<div class="form-group">
					<label for="height">Altura (cm)</label>
					<div class="input-container">
						<input type="number" id="height" step="0.1" min="50" max="250" placeholder="Ex: 175" v-model.number="height" @input="clearError('height')" required>
						<span class="input-icon">📏</span>
					</div>
					<div class="error-message" v-show="heightError">{{ heightError }}</div>
				</div>

				<CalculateButton text="Calcular IMC" />
			</form>

			<div class="result-container" :class="{ show: showResult }">
				<div class="imc-value" :style="{ color: imcColor, animation: imcPulse ? 'pulse 0.6s ease-in-out' : '' }">{{ imcValue }}</div>
				<div class="imc-category" :style="{ color: imcColor }">{{ imcCategory }}</div>
				<div class="imc-description">{{ imcDescription }}</div>
			</div>

			<div class="imc-table">
				<h3>Tabela de Referência IMC</h3>
				<div class="table-row">
					<span>Abaixo do peso</span>
					<span>&lt; 18.5</span>
				</div>
				<div class="table-row">
					<span>Peso normal</span>
					<span>18.5 - 24.9</span>
				</div>
				<div class="table-row">
					<span>Sobrepeso</span>
					<span>25.0 - 29.9</span>
				</div>
				<div class="table-row">
					<span>Obesidade Grau I</span>
					<span>30.0 - 34.9</span>
				</div>
				<div class="table-row">
					<span>Obesidade Grau II</span>
					<span>35.0 - 39.9</span>
				</div>
				<div class="table-row">
					<span>Obesidade Grau III</span>
					<span>&gt; 40.0</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CalculateButton from './CalculateButton.vue';

export default {
	name: 'CalcIMC',
	components: {
		CalculateButton
	},
		setup(_, { emit }) {
		const weight = ref(null);
		const height = ref(null);
		const weightError = ref('');
		const heightError = ref('');
		const showResult = ref(false);
		const imcValue = ref('');
		const imcCategory = ref('');
		const imcDescription = ref('');
		const imcColor = ref('white');
		const imcPulse = ref(false);
		const activeNav = ref('calculadora-imc');


			// Navegação com vue-router
			const goTo = (nav) => {
				activeNav.value = nav;
				if (nav === 'calculadora-imc') {
					window.scrollTo(0, 0);
					if (typeof window !== 'undefined' && window.location.pathname !== '/calimc') {
						// Usar router push se disponível
						if (window.$router) {
							window.$router.push('/calimc');
						} else {
							window.location.href = '/calimc';
						}
					}
				} else if (nav === 'calculadora-kalorias') {
					window.scrollTo(0, 0);
					if (typeof window !== 'undefined' && window.location.pathname !== '/calckalorias') {
						if (window.$router) {
							window.$router.push('/calckalorias');
						} else {
							window.location.href = '/calckalorias';
						}
					}
				}
			};

		function clearError(field) {
			if (field === 'weight') weightError.value = '';
			if (field === 'height') heightError.value = '';
		}

		function validateInputs(weightVal, heightVal) {
			let valid = true;
			if (!weightVal || weightVal <= 0 || weightVal > 500) {
				weightError.value = 'Por favor, insira um peso válido (1-500 kg)';
				valid = false;
			}
			if (!heightVal || heightVal <= 0 || heightVal > 250) {
				heightError.value = 'Por favor, insira uma altura válida (50-250 cm)';
				valid = false;
			}
			return valid;
		}

		function calculateIMC(weightVal, heightVal) {
			const heightInMeters = heightVal / 100;
			return weightVal / (heightInMeters * heightInMeters);
		}

		function getIMCCategory(imc) {
			if (imc < 18.5) {
				return {
					category: 'Abaixo do Peso',
					description: 'Você está abaixo do peso ideal. Considere uma dieta balanceada para ganhar peso de forma saudável.',
					color: '#00bfff'
				};
			} else if (imc < 25) {
				return {
					category: 'Peso Normal',
					description: 'Parabéns! Seu peso está dentro da faixa considerada saudável. Continue mantendo hábitos saudáveis.',
					color: '#00ff00'
				};
			} else if (imc < 30) {
				return {
					category: 'Sobrepeso',
					description: 'Você está com sobrepeso. Considere uma dieta balanceada e exercícios regulares.',
					color: '#ffa500'
				};
			} else if (imc < 35) {
				return {
					category: 'Obesidade Grau I',
					description: 'Obesidade grau I. É recomendável buscar orientação médica e nutricional.',
					color: '#ff6600'
				};
			} else if (imc < 40) {
				return {
					category: 'Obesidade Grau II',
					description: 'Obesidade grau II. É importante buscar acompanhamento médico especializado.',
					color: '#ff3300'
				};
			} else {
				return {
					category: 'Obesidade Grau III',
					description: 'Obesidade grau III. Procure acompanhamento médico urgente para cuidar da sua saúde.',
					color: '#ff0000'
				};
			}
		}

		function handleSubmit() {
			if (validateInputs(weight.value, height.value)) {
				const imc = calculateIMC(weight.value, height.value);
				const categoryInfo = getIMCCategory(imc);
				imcValue.value = imc.toFixed(1);
				imcCategory.value = categoryInfo.category;
				imcDescription.value = categoryInfo.description;
				imcColor.value = categoryInfo.color;
				showResult.value = true;
				imcPulse.value = false;
				setTimeout(() => {
					imcPulse.value = true;
					setTimeout(() => imcPulse.value = false, 600);
				}, 300);
			}
		}

		// Floating particles
		function createFloatingParticles() {
			const particleCount = 15;
			for (let i = 0; i < particleCount; i++) {
				setTimeout(() => {
					const particle = document.createElement('div');
					particle.style.cssText = `
						position: fixed;
						width: 2px;
						height: 2px;
						background: #ff0000;
						border-radius: 50%;
						pointer-events: none;
						z-index: -1;
						opacity: 0.6;
					`;
					particle.style.left = Math.random() * window.innerWidth + 'px';
					particle.style.top = window.innerHeight + 'px';
					document.body.appendChild(particle);
					const animation = particle.animate([
						{ transform: 'translateY(0px)', opacity: 0.6 },
						{ transform: `translateY(-${window.innerHeight + 100}px)`, opacity: 0 }
					], {
						duration: 8000 + Math.random() * 4000,
						easing: 'linear'
					});
					animation.onfinish = () => particle.remove();
				}, i * 800);
			}
		}

		onMounted(() => {
			// Pulsation animation style
			const style = document.createElement('style');
			style.textContent = `@keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}`;
			document.head.appendChild(style);
			setInterval(createFloatingParticles, 12000);
			createFloatingParticles();
		});

			return {
				weight,
				height,
				weightError,
				heightError,
				showResult,
				imcValue,
				imcCategory,
				imcDescription,
				imcColor,
				imcPulse,
				handleSubmit,
				clearError,
				activeNav,
				goTo
			};
	}
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Arial', sans-serif;
	background: linear-gradient(135deg, #000000 0%, #1a0000 50%, #000000 100%);
	min-height: 100vh;
	color: white;
	overflow-x: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
}

.background-animation {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	opacity: 0.1;
}

.shark-fin {
	position: absolute;
	width: 0;
	height: 0;
	border-left: 20px solid transparent;
	border-right: 20px solid transparent;
	border-bottom: 40px solid #ff0000;
	animation: swim 8s linear infinite;
}

@keyframes swim {
	0% { transform: translateX(-100px) rotate(0deg); }
	50% { transform: translateX(calc(100vw + 100px)) rotate(15deg); }
	100% { transform: translateX(-100px) rotate(0deg); }
}

.container {
	max-width: 500px;
	width: 100%;
	padding: 20px;
	min-height: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
}

.logo {
	text-align: center;
	margin-bottom: 20px;
	animation: fadeInDown 1s ease-out;
}

.logo h1 {
	margin-top: 10px;
	font-size: 3rem;
	font-weight: bold;
	background: linear-gradient(45deg, #ffffff, #ffffff, #ffffff);
	background-size: 200% 200%;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	animation: gradientShift 3s ease-in-out infinite;
	text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.logo p {
	color: #adadad;
	font-size: 1.1rem;
	margin-top: 10px;
}

@keyframes gradientShift {
	0%, 100% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
}

@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.calculator-card {
	background: rgba(0, 0, 0, 0.8);
	border: 2px solid #ff0000;
	border-radius: 20px;
	padding: 40px 60px;
	width: 100%;
	max-width: 900px;
	margin: 0 auto;
	box-shadow: 0 20px 40px rgba(255, 0, 0, 0.2);
	backdrop-filter: blur(10px);
	animation: fadeInUp 1s ease-out 0.3s both;
	position: relative;
	overflow: hidden;
}

.calculator-card::before {
	content: '';
	position: absolute;
	top: -2px;
	left: -2px;
	right: -2px;
	bottom: -2px;
	background: linear-gradient(45deg, #ff0000, transparent, #ff0000);
	border-radius: 20px;
	z-index: -1;
	animation: borderGlow 2s linear infinite;
}

@keyframes borderGlow {
	0%, 100% { opacity: 0.5; }
	50% { opacity: 1; }
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.form-group {
	margin-bottom: 25px;
	position: relative;
}

.form-group label {
	display: block;
	margin-bottom: 8px;
	color: #ffffff;
	font-weight: bold;
	font-size: 1.1rem;
	user-select: none;
}

.input-container {
	position: relative;
}

.form-group input {
	width: 100%;
	padding: 15px 120px;
	background: rgba(255, 255, 255, 0.1);
	border: 2px solid rgba(255, 0, 0, 0.3);
	border-radius: 10px;
	color: white;
	font-size: 1.25rem;
	transition: all 0.3s ease;
	backdrop-filter: blur(5px);
}

.form-group input:focus {
	outline: none;
	border-color: #ff0000;
	box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
	transform: scale(1.02);
}

.form-group input::placeholder {
	color: rgba(255, 255, 255, 0.5);
}

.input-icon {
	position: absolute;
	right: 15px;
	top: 50%;
	transform: translateY(-50%);
	color: #ff0000;
	font-size: 1.2rem;
	user-select: none;
}

.calculate-btn {
	width: 100%;
	padding: 18px;
	background: linear-gradient(45deg, #ff0000, #cc0000);
	color: white;
	border: none;
	border-radius: 10px;
	font-size: 1.2rem;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.3s ease;
	text-transform: uppercase;
	letter-spacing: 1px;
	position: relative;
	overflow: hidden;
}

.calculate-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
	transition: left 0.5s;
}

.calculate-btn:hover::before {
	left: 100%;
}

.calculate-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 25px rgba(255, 0, 0, 0.4);
}

.calculate-btn:active {
	transform: translateY(0);
}

.result-container {
	margin-top: 30px;
	padding: 25px;
	background: rgba(255, 255, 255, 0.05);
	border-radius: 15px;
	border: 1px solid rgba(255, 0, 0, 0.2);
	text-align: center;
	opacity: 0;
	transform: translateY(20px);
	transition: all 0.5s ease;
}

.result-container.show {
	opacity: 1;
	transform: translateY(0);
}

.imc-value {
	font-size: 2.5rem;
	font-weight: bold;
	margin-bottom: 10px;
	text-shadow: 0 0 10px currentColor;
}

.imc-category {
	font-size: 1.3rem;
	margin-bottom: 15px;
	font-weight: bold;
}

.imc-description {
	font-size: 1rem;
	line-height: 1.5;
	color: #cccccc;
}

.error-message {
	color: #ff4444;
	font-size: 0.9rem;
	margin-top: 5px;
	display: none;
	animation: shake 0.5s ease-in-out;
}

.error-message[style*="display: block"] {
	display: block !important;
}

@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-5px); }
	75% { transform: translateX(5px); }
}

.imc-table {
	margin-top: 10px;
	background: rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	padding: 8px 10px;
	border: 1px solid rgba(255, 0, 0, 0.2);
	max-width: 320px;
	font-size: 0.92rem;
}

.imc-table h3 {
	color: #ff0000;
	margin-bottom: 8px;
	text-align: center;
	font-size: 1.1rem;
}

.table-row {
	display: flex;
	justify-content: space-between;
	padding: 4px 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	font-size: 0.95em;
}

.table-row:last-child {
	border-bottom: none;
}

/* ===== NAVBAR CSS INÍCIO ===== */
.main-menu {
	background: linear-gradient(180deg, #232323 0%, #1a1a1a 100%);
	position: fixed;
	top: 0;
	bottom: 0;
	height: 100%;
	left: 0;
	width: 70px;
	overflow: hidden;
	transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
	z-index: 1002;
}
.main-menu:hover {
	width: 280px;
	box-shadow: 2px 0 25px rgba(255, 0, 0, 0.15);
}
.main-menu ul {
	margin: 7px 0;
	padding: 0;
	list-style: none;
}
.main-menu li {
	position: relative;
	display: block;
	width: 250px;
}
.main-menu li a {
	position: relative;
	width: 100%;
	display: table;
	color: #c5c5c5;
	font-size: 16px;
	text-decoration: none;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	font-family: 'Strait', sans-serif;
	border-top: 1px solid rgba(78, 78, 78, 0.2);
	padding: 10px 0;
	height: 55px;
	overflow: hidden;
}
.main-menu .nav-icon {
	position: relative;
	display: table-cell;
	width: 70px;
	height: 55px;
	text-align: center;
	vertical-align: middle;
	font-size: 26px;
	padding: 12px 0;
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.main-menu .nav-text {
	position: relative;
	display: table-cell;
	vertical-align: middle;
	width: 190px;
	font-family: 'Titillium Web', sans-serif;
	font-size: 16px;
	padding-left: 15px;
	opacity: 0;
	transform: translateX(-10px);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.main-menu:hover .nav-text {
	opacity: 1;
	transform: translateX(0);
}
.main-menu li:hover > a {
	color: #ffffff;
	background: linear-gradient(45deg, #323232 0%, #2b2b2b 100%);
	transform: translateX(8px);
	box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
}
.main-menu li:hover .nav-icon {
	transform: scale(1.15);
	text-shadow: 0 0 10px rgba(175, 175, 175, 0.5);
}
.main-menu li a::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 3px;
	height: 100%;
	background: #ff0000;
	transform: scaleY(0);
	transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.main-menu li:hover a::before {
	transform: scaleY(1);
}
.logo-container {
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
}
.logo-container img {
	max-width: 100%;
	max-height: 120px;
}
.main-menu li a.active {
	background: linear-gradient(45deg, #373737 0%, #292929 100%);
	color: #ffffff;
	position: relative;
	box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2);
}
.main-menu li a.active::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 3px;
	height: 100%;
	background: #ff0303;
	transform: scaleY(1);
}
.main-menu li a.active .nav-icon {
	transform: scale(1.15);
	text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
/* ===== NAVBAR CSS FIM ===== */

@media (max-width: 600px) {
	body {
		flex-direction: column;
		align-items: stretch;
	}
	.container {
		margin-left: 0 !important;
		padding: 15px;
	}
	.calculator-card {
		width: 100%;
		max-width: 100%;
		padding: 25px;
	}
	.logo h1 {
		font-size: 2.5rem;
	}
}

@media (min-width: 601px) {
  .container {
    margin-left: 0 !important;
  }
}

.logo img {
	width: 100px;
	height: auto;
}

.form-group label, .input-icon {
	user-select: none;
}
/* Título da página acima do card */
.page-title {
	color: #fff;
	font-size: 2.1rem;
	font-weight: bold;
	margin-bottom: 18px;
	text-align: center;
	letter-spacing: 1px;
	text-shadow: 0 2px 8px #000, 0 0 2px #ff0000;
    
}
</style>
