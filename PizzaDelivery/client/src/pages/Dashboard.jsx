import "./Dashboard.css";

function Dashboard() {
  const pizzas = [
  {
    name: "Margherita",
    description: "Classic tomato and cheese pizza.",
    price: 249,
    image: "/pizza-images/margherita.png",
  },
  {
    name: "Farmhouse",
    description: "Fresh vegetables with delicious cheese.",
    price: 299,
    image: "/pizza-images/farmhouse.png",
  },
  {
    name: "Cheese Burst",
    description: "Extra cheese for cheese lovers.",
    price: 349,
    image: "/pizza-images/cheese-burst.png",
  },
  {
    name: "Paneer Tikka",
    description: "Spicy paneer with Indian flavors.",
    price: 379,
    image: "/pizza-images/paneer-tikka.png",
  },
  {
    name: "Veggie Supreme",
    description: "Loaded with fresh and flavorful vegetables.",
    price: 329,
    image: "/pizza-images/veggie-supreme.png",
  },
  {
    name: "Spicy Chicken",
    description: "Juicy chicken with a spicy kick.",
    price: 399,
    image: "/pizza-images/spicy-chicken.png",
  },
  {
    name: "BBQ Chicken",
    description: "Smoky BBQ chicken with rich flavors.",
    price: 429,
    image: "/pizza-images/bbq-chicken.png",
  },
  {
    name: "Loaded Cheese",
    description: "Loaded with delicious melted cheese.",
    price: 369,
    image: "/pizza-images/loaded-cheese.png",
  },
];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
  <span>OUR MENU</span>

  <h1>Explore Our Pizzas</h1>

  <p>Choose your favorite pizza and customize it your way.</p>
</div>

      <div className="pizza-grid">
        {pizzas.map((pizza) => (
          <div className="dashboard-card" key={pizza.name}>
            <div className="dashboard-image">
               <img src={pizza.image} alt={`${pizza.name} Pizza`} />
            </div>

            
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