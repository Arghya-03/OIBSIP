import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Admin orders error:", error);
      }
    };

   fetchOrders();

const fetchInventory = async () => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(
      "http://localhost:5000/api/admin/inventory",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setInventory(data.inventory);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Inventory fetch error:", error);
  }
};

fetchInventory();
}, []);

  return (
    <div className="admin-dashboard">
      <h1>👨‍💼 Admin Dashboard</h1>

            <h2>📦 Customer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <p>
              <strong>Customer:</strong>{" "}
              {order.userId?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.userId?.email}
            </p>

            <p>
              <strong>Size:</strong> {order.size}
            </p>

            <p>
              <strong>Base:</strong> {order.base}
            </p>

            <p>
              <strong>Sauce:</strong> {order.sauce}
            </p>

            <p>
              <strong>Cheese:</strong> {order.cheese}
            </p>

            <p>
              <strong>Toppings:</strong>{" "}
              {order.toppings.length > 0
                ? order.toppings.join(", ")
                : "None"}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentStatus}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <select
              value={order.status}
              onChange={async (e) => {
                const newStatus = e.target.value;

                try {
                  const token = localStorage.getItem("adminToken");

                  const response = await fetch(
                    `http://localhost:5000/api/admin/orders/${order._id}/status`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        status: newStatus,
                      }),
                    }
                  );

                  const data = await response.json();

                  if (response.ok) {
                    setOrders((previousOrders) =>
                      previousOrders.map((item) =>
                        item._id === order._id
                          ? { ...item, status: newStatus }
                          : item
                      )
                    );

                    alert("✅ Order status updated!");
                  } else {
                    alert("❌ " + data.message);
                  }
                } catch (error) {
                  console.error("Status update error:", error);
                  alert("❌ Could not update order status.");
                }
              }}
            >
              <option value="Order Received">
                Order Received
              </option>

              <option value="In Kitchen">
                In Kitchen
              </option>

              <option value="Sent to Delivery">
                Sent to Delivery
              </option>
            </select>
          </div>
        ))
      )}

      <h2>📦 Inventory</h2>

      {inventory.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        inventory.map((item) => (
          <div className="inventory-card" key={item._id}>
            <p>
              <strong>{item.name}</strong>
            </p>

            <p>Category: {item.category}</p>

            <p>
              Stock: {item.stock}
            </p>

            <input
              type="number"
              value={item.stock}
              min="0"
              onChange={(e) => {
                setInventory((previousInventory) =>
                  previousInventory.map((inventoryItem) =>
                    inventoryItem._id === item._id
                      ? {
                          ...inventoryItem,
                          stock: Number(e.target.value),
                        }
                      : inventoryItem
                  )
                );
              }}
            />

            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("adminToken");

                  const response = await fetch(
                    `http://localhost:5000/api/admin/inventory/${item._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        stock: item.stock,
                      }),
                    }
                  );

                  const data = await response.json();

                  if (response.ok) {
                    alert("✅ Stock updated successfully!");
                  } else {
                    alert("❌ " + data.message);
                  }
                } catch (error) {
                  console.error("Stock update error:", error);
                  alert("❌ Could not update stock.");
                }
              }}
            >
              Save Stock
            </button>

            <p>
              Low Stock Threshold: {item.lowStockThreshold}
            </p>

            <hr />
          </div>
        ))
      )}

    </div>
  );
}

export default AdminDashboard;