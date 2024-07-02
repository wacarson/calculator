/*TO DO
Handle negatives
Add parentheses support
Add backspace suppport
Deal with syntax errors & div by zero
Fix issue where clicking container adds all buttons to display*/

//globals
let operator = ''
let nonNums = ['+', '-', '*', '/', '(', ')']
let sequence = []
let state = false
let lock = false
//functional stuff
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
//number buttons
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
//set up listener
let container = document.querySelector(".container")
container.addEventListener("click", buttonPress)


//event function
function buttonPress(e) {
	button = event.target.textContent;
	if(state ==  true) {		//checks if the display is the result of prior math
		state = false
		if (nonNums.includes(button)) {
			currentNum = screen.textContent
			sequence.push(currentNum)	//uses result as initial number if operator pressed
		} else {
			clear()		//otherwise start a new chain of math
		}
	}
	sequence.push(button)	//store button presses
	display(button)			//show button press
	if (button == 'CLEAR') {
		clear()
	}
	if (button == '=') {
		sequence.pop() //remove the equals sign and deal with data
		parse()
	}
}

//math functions
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
	return x/y
}

//checks which operator is used and calls proper function
function operate(x, y, op) {
	if (op == '+') { return add(x, y) }
	else if (op == '-') { return subtract(x, y) }
	else if (op == '*') { return multiply(x, y) }
	else if (op == '/') { return divide(x, y) }
}

//updates display
function display(item) {
	currentDisp = screen.textContent
	if (currentDisp == '0') {currentDisp = ""}
	screen.textContent = currentDisp + item
}

//refresh program
function clear() {
	screen.textContent = "0"
	operator = ''
	sequence = []
	flag = false
	lock = false
}

function syntaxCheck() {
	if (nonNums.includes(sequence[-1])){
		clear()
		display("Syntax error. Hit Clear")
		lock = true
		return true
	}
}

//work out the math function from the text
function parse() {
	if (syntaxCheck()) {
		return
	}
	equation = sequence.toString() //convert array to one string
	equation = equation.replaceAll(',', '') //remove commas from conversion
	num1 = ''
	num2 = ''
	flag = false
	divisionFlag = false
	divisionByZeroFlag = false
	//checks one char at a time and combines them into format of number1 operator number2 operator etc
	//this is getting messy. maybe break it up into different functions
	//the flags don't work
	for(let i=0; i<equation.length; i++) {
		bit = equation[i]

		if (!nonNums.includes(bit) && !flag) {
			num1 += bit
			divisionByZeroFlag = false
		} else if (!nonNums.includes(bit) && flag) {
			num2 += bit
			divisionByZeroFlag = false
		} else if (nonNums.includes(bit) && !flag) {
			operator = bit
			flag = true
			if (divisionByZeroFlag) {
				clear()
				display("Don't divide by zero. Hit Clear.")
				lock = true
				return
			}
			if (bit == '/') {
				divisionFlag = true
			} else {
				divisionFlag = false
			}
		} else if (nonNums.includes(bit) && flag) {
			//if a second operand is used, complete first equationa nd continue
			num1 = '' + operate(parseFloat(num1), parseFloat(num2), operator)
			num2 = ''
			operator = bit
			if (bit == '/') {
				divisionFlag = true
			} else {
				divisionFlag = false
			}
			if (divisionByZeroFlag) {
				clear()
				display("Don't divide by zero")
				return
			}
		}
		if (divisionFlag && bit == '0') {
			divisionByZeroFlag = true
		}
	}
	result = operate(parseFloat(num1), parseFloat(num2), operator)
	clear()
	display(result)
	state = true
}
