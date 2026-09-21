import "./Dashboard.css";

function Dashboard() {
  const pizzas = [
    {
      name: "Margherita",
      description: "Classic tomato and cheese pizza.",
      price: 249,
    },
    {
      name: "Farmhouse",
      description: "Fresh vegetables with delicious cheese.",
      price: 299,
    },
    {
      name: "Cheese Burst",
      description: "Extra cheese for cheese lovers.",
      price: 349,
    },
    {
      name: "Pepperoni",
      description: "Loaded with tasty pepperoni.",
      price: 399,
    },
    {
      name: "Paneer Tikka",
      description: "Spicy paneer with Indian flavors.",
      price: 379,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🍕 Pizza Dashboard</h1>
        <p>Choose your favorite pizza and customize it your way.</p>
      </div>

      <div className="pizza-grid">
        {pizzas.map((pizza) => (
          <div className="dashboard-card" key={pizza.name}>
            <h3>{pizza.name}</h3>

            <p>{pizza.description}</p>

            <p className="dashboard-price">
              ₹{pizza.price}
            </p>

            <button
              className="customize-button"
              onClick={() => {
                window.location.href = "/builder";
              }}
            >
              Customize Pizza
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;