import "./OrderTracking.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function OrderTracking() {


  const [status, setStatus] = useState("Loading...");

  
  useEffect(() => {
  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("🔌 Frontend Socket connected:", socket.id);
  });

  socket.on("orderStatusUpdated", (data) => {
    
    setStatus(data.status);
  });

  const fetchOrderStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders/latest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus(data.order.status);

        socket.emit("joinOrderRoom", data.order._id);
      } else {
        setStatus("No order found");
      }
    } catch (error) {
      console.error("Order tracking error:", error);
      setStatus("Could not load order");
    }
  };

  fetchOrderStatus();

  return () => {
    socket.disconnect();
  };
}, []);

  return (
  <div className="order-tracking">
    <div className="tracking-header">
      <span>ORDER TRACKING</span>
      <h1>Track Your Pizza</h1>
      <p>Follow your order from our kitchen to your doorstep.</p>
    </div>

    <div className="tracking-card">
      <div className="tracking-card-header">
        <div>
          <span className="tracking-label">CURRENT STATUS</span>
          <h2>{status}</h2>
        </div>

        <div className="tracking-icon">🍕</div>
      </div>

      <div className="tracking-steps">

        <div
          className={`tracking-step ${
            status === "Order Received" ||
            status === "In Kitchen" ||
            status === "Sent to Delivery"
              ? "completed"
              : ""
          }`}
        >
          <div className="step-circle">✓</div>
          <div className="step-content">
            <h3>Order Received</h3>
            <p>Your order has been received successfully.</p>
          </div>
        </div>

        <div
          className={`tracking-step ${
            status === "In Kitchen" ||
            status === "Sent to Delivery"
              ? "completed"
              : ""
          }`}
        >
          <div className="step-circle">✓</div>
          <div className="step-content">
            <h3>In Kitchen</h3>
            <p>Your pizza is being prepared fresh.</p>
          </div>
        </div>

        <div
          className={`tracking-step ${
            status === "Sent to Delivery"
              ? "completed"
              : ""
          }`}
        >
          <div className="step-circle">✓</div>
          <div className="step-content">
            <h3>Sent to Delivery</h3>
            <p>Your pizza is on its way to you.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default OrderTracking;