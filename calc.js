/*TO DO
Handle negatives
Add parentheses support
expand syntax errors
*/

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
	if (event.target.tagName == "DIV") {
		return
	}
	button = event.target.textContent;
	if (button == 'CLEAR') {
		clear()
		return
	}

	if (lock) {
		return
	}

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
	if (button == 'CLEAR') {
		clear()
		return
	} else if (button == 'BACK') {
		sequence.pop()
		backspace()
		return
	} else if (button == '=') {
		sequence.pop() //remove the equals sign and deal with data
		parse()
		return
	}
	display(button)			//show button press
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

//removes most recent button press
function backspace() {
	sequence.pop()
	currentview = screen.textContent
	updatedview = currentview.substring(0, currentview.length-1)
	screen.textContent = ""
	display(updatedview)
}

//see if they hit equals with a hanging operator
//needs to be expanded for other syntax errors like double operators
function syntaxCheck() {
	x = sequence.length
	if (nonNums.includes(sequence[x-1])){
		if (sequence[x-1] == ")") {
			return false
		}
		clear()
		display("Syntax error. Hit Clear")
		lock = true
		return true
	}
}


//check for a sequence of /0 followed by another operator
function divByZero() {
	divisionLocs = []
	divByZeroCheck = []
	for (let i=0; i<sequence.length; i++) {
		if (sequence[i] == '/') {
			divisionLocs.push(i)
		}
	}

	for (let i=0; i<divisionLocs.length; i++) {
		if (sequence[divisionLocs[i]+1] == '0') {
			divByZeroCheck.push(divisionLocs[i] + 1)
		}
	}

	for (let i=0; i<divByZeroCheck.length; i++) {
		check = divByZeroCheck[i] + 1
		if (!nonNums.includes(sequence[check]) || sequence[check] != '.') {
			clear()
			display("Do not divide by zero. Hit Clear")
			lock = true
			return true
		}
	}
}

//work out the math function from the text
function parse() {
	if (syntaxCheck()) {
		return
	} else if (divByZero()) {
		return
	}
	equation = sequence.toString() //convert array to one string
	equation = equation.replaceAll(',', '') //remove commas from conversion
	num1 = ''
	num2 = ''
	flag = false
	//checks one char at a time and combines them into format of number1 operator number2 operator etc
	for(let i=0; i<equation.length; i++) {
		bit = equation[i]

		if (!nonNums.includes(bit) && !flag) {
			num1 += bit
		} else if (!nonNums.includes(bit) && flag) {
			num2 += bit
		} else if (nonNums.includes(bit) && !flag) {
			operator = bit
			flag = true
		} else if (nonNums.includes(bit) && flag) {
			//if a second operand is used, complete first equationa nd continue
			num1 = '' + operate(parseFloat(num1), parseFloat(num2), operator)
			num2 = ''
			operator = bit
		}
	}
	result = operate(parseFloat(num1), parseFloat(num2), operator)
	clear()
	display(result)
	state = true
}
