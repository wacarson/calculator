/*GOALS
Add exponents
Add keyboard support
Use correct PEMDAS sequence
*/

//globals
let operator = ''
let opsList = ['+', '-', '*', '/']
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

	if (lock) { //forces user to hit clear
		return
	}

	if(state ==  true) {
		if (button == '=') {
			return
		}
	//checks if the display is the result of prior math
		state = false
		if (opsList.includes(button)) {
			currentNum = screen.textContent
			sequence.push(currentNum)
			//uses result as initial number if operator pressed
		} else {
			clear()		//otherwise start a new chain of math
		}
	}

	sequence.push(button)	//store button presses
	if (button == '(-)') {
		sequence.pop()
		sequence.push('?')
		button = '-' //not sure how to deal with negative sign & minus sign
		//so the solution is use a different symbol behind the scenes
	}
	if (button == 'CLEAR') {
		clear()
		return
	} else if (button == 'BACK') {
		sequence.pop()
		backspace()
		return
	} else if (button == '=') {
		sequence.pop() //remove the equals sign and deal with data
		if (checkErrors()) {
			return
		}
		number = parse(sequence)
		clear()
		display(number)
		state = true
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
	flag = false
	if (opsList.includes(sequence[x-1])){
		flag = true
	}
	if (opsList.includes(sequence[0])) {
		flag = true
	}
	for (let i=1; i<x-1; i++) {
		firstcase = opsList.includes(sequence[i-1])
		secondcase = opsList.includes(sequence[i])
		if (firstcase && secondcase) {
			flag = true
		}
	}
//all these flag = false statements would be breaks if allowed
	if (flag) {
		clear()
		display("Syntax error. Hit Clear")
		lock = true
		return true
	} else {
		return false
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
		if (!opsList.includes(sequence[check]) || sequence[check] != '.') {
			clear()
			display("Do not divide by zero. Hit Clear")
			lock = true
			return true
		}
	}
}


function checkParentheses() {
	leftpLoc = []
	pcount = 0
	failflag = false
	for(let i=0; i <= sequence.length-1; i++) {
		if (sequence[i] == '(') {
			pcount++
			leftpLoc.push(i)
			if (opsList.includes(sequence[i+1])) {
				failflag = true
				break
			}
		} else if (sequence[i] == ')') {
			pcount++
			left = leftpLoc.pop()
			right = i
			if (opsList.includes(sequence[i-1])) {
				failflag = true
				break
			}
			handleParentheses(left+1, right)
		}
	}

	if (pcount % 2 != 0) {
		failflag = true
	}

	if (failflag) {
		clear()
		display("Syntax error. Hit Clear")
		lock = true
		return true
	}
}



function handleParentheses(left, right) {
	subarray = sequence.slice(left,right)
	result = parse(subarray)
	sequence[left-1] = result
	for (let i=left; i<=right; i++) {
		sequence[i] = ''
	}
}

function checkErrors() {
	if (syntaxCheck()) {
		return true
	} else if (divByZero()) {
		return true
	}

	if (checkParentheses()) {
		return true
	}

	return false
}

//work out the math function from the text
function parse(maths) {
	equation = maths.toString() //convert array to one string
	equation = equation.replaceAll(',', '') //remove commas from conversion
	num1 = ''
	num2 = ''
	flag = false
	//checks one char at a time and combines them into format of number1 operator number2 operator etc
	for(let i=0; i<equation.length; i++) {
		bit = equation[i]

		if (!opsList.includes(bit) && !flag) {
			if (bit == '?') { bit = '-' }
			num1 += bit
		} else if (!opsList.includes(bit) && flag) {
			if (bit == '?') { bit = '-' }
			num2 += bit
		} else if (opsList.includes(bit) && !flag) {
			operator = bit
			flag = true
		} else if (opsList.includes(bit) && flag) {
			//if a second operand is used, complete first equationa nd continue
			num1 = '' + operate(parseFloat(num1), parseFloat(num2), operator)
			num2 = ''
			operator = bit
		}
	}
	result = operate(parseFloat(num1), parseFloat(num2), operator)
	result = Math.round(result*10000)/10000
	return result
}
