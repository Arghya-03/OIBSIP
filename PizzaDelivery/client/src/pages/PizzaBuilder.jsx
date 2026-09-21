import "./PizzaBuilder.css";

import { useState } from "react";
import Payment from "./Payment";

function PizzaBuilder() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [selectedSauce, setSelectedSauce] = useState("");
  const [selectedCheese, setSelectedCheese] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  const sizes = [
    "Small",
    "Medium",
    "Large",
  ];

  const bases = [
    "Thin Crust",
    "Classic Crust",
    "Cheese Burst",
    "Wheat Base",
    "Pan Base",
  ];

  const sauces = [
    "Tomato Sauce",
    "Spicy Sauce",
    "BBQ Sauce",
    "Garlic Sauce",
    "Pesto Sauce",
  ];

  const cheeses = [
    "Mozzarella",
    "Cheddar",
    "Parmesan",
    "Gouda",
    "Cheese Blend",
  ];

  const toppings = [
    "Onion",
    "Capsicum",
    "Corn",
    "Mushroom",
    "Tomato",
    "Jalapeño",
    "Olives",
    "Oregano",
    "Paneer",
    "Chicken",
    "Salami",
    "Kebab",
  ];

  const handleToppingChange = (topping) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(
        selectedToppings.filter((item) => item !== topping)
      );
    } else {
      setSelectedToppings([
        ...selectedToppings,
        topping,
      ]);
    }
  };

  const handleProceedToPayment = () => {
  if (!selectedSize) {
    alert("⚠️ Please select your pizza size.");
    return;
  }

  if (!selectedBase) {
    alert("⚠️ Please select your pizza base.");
    return;
  }

  if (!selectedSauce) {
    alert("⚠️ Please select your sauce.");
    return;
  }

  if (!selectedCheese) {
    alert("⚠️ Please select your cheese.");
    return;
  }

  setShowPayment(true);
};

if (showPayment) {
  return (
    <Payment
      selectedSize={selectedSize}
      selectedBase={selectedBase}
      selectedSauce={selectedSauce}
      selectedCheese={selectedCheese}
      selectedToppings={selectedToppings}
    />
  );
}

  return (
  <div className="pizza-builder">
    <h1 className="builder-title">🍕 Build Your Pizza</h1>

    <div className="builder-step">
      <h2>Step 1: Choose Your Pizza Size</h2>

      <div className="option-group">
        {["Small", "Medium", "Large"].map((size) => (
          <button
            key={size}
            className={`option-button ${
              selectedSize === size ? "selected" : ""
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      <p className="selected-value">
        Selected Size: <strong>{selectedSize || "Nothing selected"}</strong>
      </p>
    </div>

    <div className="builder-step">
      <h2>Step 2: Choose Your Base</h2>

      <div className="option-group">
        {[
          "Thin Crust",
          "Classic Crust",
          "Cheese Burst",
          "Wheat Base",
          "Pan Base",
        ].map((base) => (
          <button
            key={base}
            className={`option-button ${
              selectedBase === base ? "selected" : ""
            }`}
            onClick={() => setSelectedBase(base)}
          >
            {base}
          </button>
        ))}
      </div>

      <p className="selected-value">
        Selected Base: <strong>{selectedBase || "Nothing selected"}</strong>
      </p>
    </div>

    <div className="builder-step">
      <h2>Step 3: Choose Your Sauce</h2>

      <div className="option-group">
        {[
          "Tomato Sauce",
          "Spicy Sauce",
          "BBQ Sauce",
          "Garlic Sauce",
          "Pesto Sauce",
        ].map((sauce) => (
          <button
            key={sauce}
            className={`option-button ${
              selectedSauce === sauce ? "selected" : ""
            }`}
            onClick={() => setSelectedSauce(sauce)}
          >
            {sauce}
          </button>
        ))}
      </div>

      <p className="selected-value">
        Selected Sauce: <strong>{selectedSauce || "Nothing selected"}</strong>
      </p>
    </div>

    <div className="builder-step">
      <h2>Step 4: Choose Your Cheese</h2>

      <div className="option-group">
        {[
          "Mozzarella",
          "Cheddar",
          "Parmesan",
          "Gouda",
          "Cheese Blend",
        ].map((cheese) => (
          <button
            key={cheese}
            className={`option-button ${
              selectedCheese === cheese ? "selected" : ""
            }`}
            onClick={() => setSelectedCheese(cheese)}
          >
            {cheese}
          </button>
        ))}
      </div>

      <p className="selected-value">
        Selected Cheese:{" "}
        <strong>{selectedCheese || "Nothing selected"}</strong>
      </p>
    </div>

    <div className="builder-step">
      <h2>Step 5: Choose Your Toppings</h2>

      <div className="topping-group">
        {[
          "Onion",
          "Capsicum",
          "Corn",
          "Mushroom",
          "Tomato",
          "Jalapeño",
          "Olives",
          "Oregano",
          "Paneer",
          "Chicken",
          "Salami",
          "Kebab",
        ].map((topping) => (
          <label className="topping-item" key={topping}>
            <input
              type="checkbox"
              checked={selectedToppings.includes(topping)}
              onChange={() => handleToppingChange(topping)}
            />{" "}
            {topping}
          </label>
        ))}
      </div>

      <p className="selected-value">
        Selected Toppings:{" "}
        <strong>
          {selectedToppings.length > 0
            ? selectedToppings.join(", ")
            : "Nothing selected"}
        </strong>
      </p>
    </div>

    <div className="order-summary">
      <h2>🧾 Order Summary</h2>

      <p>
        <strong>Size:</strong> {selectedSize || "Not selected"}
      </p>

      <p>
        <strong>Base:</strong> {selectedBase || "Not selected"}
      </p>

      <p>
        <strong>Sauce:</strong> {selectedSauce || "Not selected"}
      </p>

      <p>
        <strong>Cheese:</strong> {selectedCheese || "Not selected"}
      </p>

      <p>
        <strong>Toppings:</strong>{" "}
        {selectedToppings.length > 0
          ? selectedToppings.join(", ")
          : "No toppings selected"}
      </p>

      <button
        className="payment-button"
        onClick={handleProceedToPayment}
      >
        Proceed to Payment
      </button>
    </div>
  </div>
);

}

export default PizzaBuilder;