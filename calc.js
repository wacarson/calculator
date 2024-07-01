let operator = ''
let num1 = 0
let num2 = 0
let result = 0
let nonNums = ['+', '-', '*', '/', '(', ')']
let sequence = []
let screen = document.querySelector("#display")
let plusB = document.querySelector("#plus")
let minusB = document.querySelector("#minus")
let timesB = document.querySelector("#times")
let divideB = document.querySelector("#divide")
let clearB = document.querySelector("#clear")
let equalB = document.querySelector("#equals")
let leftpB = document.querySelector("#leftp")
let rightpB = document.querySelector("#rightp")
let backB = document.querySelector("#back")

let B1 = document.querySelector("#one")
let B2 = document.querySelector("#two")
let B3 = document.querySelector("#three")
let B4 = document.querySelector("#four")
let B5 = document.querySelector("#five")
let B6 = document.querySelector("#six")
let B7 = document.querySelector("#seven")
let B8 = document.querySelector("#eight")
let B9 = document.querySelector("#nine")
let B0 = document.querySelector("#zero")

let container = document.querySelector(".container")
container.addEventListener("click", buttonPress)

function buttonPress(e) {
	button = event.target.textContent;
	sequence.push(button)
	display(button)
	if (button == 'CLEAR') { clear() }
	if (button == '=') {
		sequence.pop()
		parse()
	}
}

function add(x, y) {
	return x + y
}

function subtract(x, y) {
	return x - y
}

function multiply(x, y) {
	return x * y
}

function divide(x, y) {
	return x*10.0/y/10.0
}

function operate(x, y, op) {
	if (op == '+') { return add(x, y) }
	else if (op == '-') { return subtract(x, y) }
	else if (op == '*') { return multiply(x, y) }
	else if (op == '/') { return divide(x, y) }
}

function display(item) {
	currentDisp = screen.textContent
	if (currentDisp == '0') {currentDisp = ""}
	screen.textContent = currentDisp + item
}

function clear() {
	screen.textContent = "0"
	num1 = 0
	num2 = 0
	operator = ''
}

function parse() {
	equation = sequence.toString()
	equation = equation.replaceAll(',', '')
	flag = false
	for(let i=0; i<equation.length; i++) {
		bit = equation[i]
		if (!nonNums.includes(bit) && !flag) {
			num1 += parseFloat(bit)
		} else if (!nonNums.includes(bit) && flag) {
			num2 += parseFloat(bit)
		} else if (nonNums.includes(bit) && !flag) {
			operator = bit
			flag = true
		} else if (nonNums.includes(bit) && flag) {
			flag = false
			result = operate(num1, num2, operator)
			operator = bit
		}
	}
	result = operate(num1, num2, operator)
	clear()
	display(result)
}
