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
    <div>
      <h1>📦 Order Tracking</h1>

      <h2>Your Order Status</h2>

      <p>Current Status:</p>

      <h3>{status}</h3>

      <div>
 <p>
    {status === "Order Received" ? "🟢" : "⚪"} Order Received
  </p>

  <p>
    {status === "In Kitchen" ? "🟢" : "⚪"} In Kitchen
  </p>

  <p>
    {status === "Sent to Delivery" ? "🟢" : "⚪"} Sent to Delivery
  </p>
      </div>
    </div>
  );
}

export default OrderTracking;