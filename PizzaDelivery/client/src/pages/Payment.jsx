import "./Payment.css";

function Payment({
  selectedSize,
  selectedBase,
  selectedSauce,
  selectedCheese,
  selectedToppings,
}) {

    const sendOrderToBackend = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
         amount: 399,
         size: selectedSize,
          base: selectedBase,
          sauce: selectedSauce,
         cheese: selectedCheese,
         toppings: selectedToppings,
        }),
      }
    );

    const data = await response.json();

    console.log("Razorpay order:", data);

    if (response.ok) {

      const options = {
  key: "rzp_test_TdsP5rp5iYHhcT",
  amount: data.order.amount,
  currency: data.order.currency,
  name: "Pizza Delivery",
  description: "Pizza Order",
  order_id: data.order.id,
  handler: async function (paymentResponse) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/payment/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentResponse),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Payment verified:", data);
      alert("✅ Payment verified successfully!");
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    alert("❌ Could not verify payment.");
  }
},
};

const razorpay = new window.Razorpay(options);
razorpay.open();

      alert("✅ Razorpay order created successfully!");
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Payment error:", error);

    alert("❌ Could not create Razorpay order.");
  }
};

   

 return (
  <div className="payment-page">
    <div className="payment-container">
      <h1 className="payment-title">💳 Payment</h1>

      <h2>🧾 Your Pizza Order</h2>

      <div className="payment-detail">
        <strong>Size</strong>
        <span>{selectedSize}</span>
      </div>

      <div className="payment-detail">
        <strong>Base</strong>
        <span>{selectedBase}</span>
      </div>

      <div className="payment-detail">
        <strong>Sauce</strong>
        <span>{selectedSauce}</span>
      </div>

      <div className="payment-detail">
        <strong>Cheese</strong>
        <span>{selectedCheese}</span>
      </div>

      <div className="payment-detail">
        <strong>Toppings</strong>
        <span>
          {selectedToppings.length > 0
            ? selectedToppings.join(", ")
            : "No toppings selected"}
        </span>
      </div>

      <button className="pay-button" onClick={sendOrderToBackend}>
        Pay Now
      </button>
    </div>
  </div>
);

}

export default Payment;