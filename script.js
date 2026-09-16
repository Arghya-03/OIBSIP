const temperatureInput = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");


convertBtn.addEventListener("click", function () {

    const temperature = parseFloat(temperatureInput.value);
    const from = fromUnit.value;
    const to = toUnit.value;


    // Check for empty input
    if (isNaN(temperature)) {

        result.textContent = "Enter a temperature";

        return;
    }


    // Kelvin cannot be below 0
    if (from === "kelvin" && temperature < 0) {

        result.textContent = "Invalid Kelvin value";

        return;
    }


    let celsius;


    // First convert the value to Celsius

    if (from === "celsius") {

        celsius = temperature;

    } else if (from === "fahrenheit") {

        celsius = (temperature - 32) * 5 / 9;

    } else {

        celsius = temperature - 273.15;
    }


    let convertedTemperature;


    // Convert Celsius to the selected unit

    if (to === "celsius") {

        convertedTemperature = celsius;

    } else if (to === "fahrenheit") {

        convertedTemperature = (celsius * 9 / 5) + 32;

    } else {

        convertedTemperature = celsius + 273.15;
    }


    // Display the final answer

    result.textContent =
        convertedTemperature.toFixed(2) +
        " " +
        getUnitSymbol(to);

});


function getUnitSymbol(unit) {

    if (unit === "celsius") {
        return "°C";
    }

    if (unit === "fahrenheit") {
        return "°F";
    }

    return "K";
}