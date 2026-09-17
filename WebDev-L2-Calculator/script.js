const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");

const clearButton = document.querySelector("[data-action='clear']");
const backspaceButton = document.querySelector("[data-action='backspace']");
const equalsButton = document.querySelector("[data-action='equals']");


let currentInput = "";
let firstNumber = null;
let currentOperator = null;
let waitingForSecondNumber = false;


/* =========================
   NUMBER BUTTONS
========================= */

numberButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const number = button.dataset.number;

        if (number === "." && currentInput.includes(".")) {
            return;
        }

        if (waitingForSecondNumber) {

            currentInput = "";

            waitingForSecondNumber = false;
        }

        if (number === "." && currentInput === "") {
            currentInput = "0";
        }

        currentInput += number;

        updateDisplay();

    });

});


/* =========================
   OPERATOR BUTTONS
========================= */

operatorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const operator = button.dataset.operator;

        if (currentInput === "" && firstNumber === null) {
            return;
        }

        if (firstNumber === null) {

            firstNumber = parseFloat(currentInput);

        } else if (!waitingForSecondNumber) {

            calculate();

        }

        currentOperator = operator;

        waitingForSecondNumber = true;

        updateDisplay();

    });

});


/* =========================
   EQUALS BUTTON
========================= */

equalsButton.addEventListener("click", function () {

    if (
        firstNumber === null ||
        currentInput === "" ||
        currentOperator === null
    ) {
        return;
    }

    calculate();

    currentOperator = null;

    waitingForSecondNumber = true;

    updateDisplay();

});


/* =========================
   CALCULATION
========================= */

function calculate() {

    const secondNumber = parseFloat(currentInput);

    let answer;


    switch (currentOperator) {

        case "+":
            answer = firstNumber + secondNumber;
            break;

        case "-":
            answer = firstNumber - secondNumber;
            break;

        case "*":
            answer = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {

                resultDisplay.textContent = "Cannot divide by 0";

                currentInput = "";
                firstNumber = null;
                currentOperator = null;

                return;
            }

            answer = firstNumber / secondNumber;

            break;

        default:
            return;
    }


    firstNumber = answer;

    currentInput = formatNumber(answer);

}


/* =========================
   CLEAR
========================= */

clearButton.addEventListener("click", function () {

    currentInput = "";

    firstNumber = null;

    currentOperator = null;

    waitingForSecondNumber = false;

    expressionDisplay.textContent = "0";

    resultDisplay.textContent = "0";

});


/* =========================
   BACKSPACE
========================= */

backspaceButton.addEventListener("click", function () {

    if (waitingForSecondNumber) {
        return;
    }

    currentInput = currentInput.slice(0, -1);

    updateDisplay();

});


/* =========================
   DISPLAY
========================= */

function updateDisplay() {

    if (currentInput === "") {

        resultDisplay.textContent = "0";

    } else {

        resultDisplay.textContent = currentInput;

    }


    let expression = "";

    if (firstNumber !== null) {

        expression += formatNumber(firstNumber);

    }

    if (currentOperator !== null) {

        expression += " " + getOperatorSymbol(currentOperator);

    }

    expressionDisplay.textContent =
        expression === "" ? "0" : expression;

}


/* =========================
   OPERATOR SYMBOL
========================= */

function getOperatorSymbol(operator) {

    switch (operator) {

        case "+":
            return "+";

        case "-":
            return "−";

        case "*":
            return "×";

        case "/":
            return "÷";

        default:
            return "";

    }

}


/* =========================
   NUMBER FORMATTING
========================= */

function formatNumber(number) {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return Number(number.toFixed(10)).toString();

}