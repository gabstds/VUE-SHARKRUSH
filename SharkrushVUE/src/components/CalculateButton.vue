<template>
  <button :type="type" class="calculate-btn">
    <slot>{{ text }}</slot>
  </button>
</template>

<script>
export default {
  name: 'CalculateButton',
  props: {
    text: {
      type: String,
      default: 'Calcular'
    },
    type: {
      type: String,
      default: 'submit'
    }
  }
}
</script>

<style scoped>
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
</style>
