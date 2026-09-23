import { useState } from "react";
import "./App.css";
import PizzaBuilder from "./pages/PizzaBuilder";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import OrderTracking from "./pages/OrderTracking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  if (window.location.pathname === "/dashboard") {
  return <Dashboard />;
}

  if (window.location.pathname === "/builder") {
  return <PizzaBuilder />;
}

if (window.location.pathname === "/order-tracking") {
  return <OrderTracking />;
}

  if (window.location.pathname.startsWith("/verify/")) {
  return <VerifyEmail />;
}

  if (window.location.pathname === "/forgot-password") {
  return <ForgotPassword />;
}

  if (window.location.pathname.startsWith("/reset-password/")) {
  return <ResetPassword />;
}

  if (window.location.pathname === "/admin-login") {
  return <AdminLogin />;
}

  if (window.location.pathname === "/admin") {
  return <AdminDashboard />;
}

  if (showRegister) {
  return <Register />;
}

  if (showLogin) {
  return <Login />;
}

  if (showDashboard) {
  return <Dashboard />;
}

  if (showBuilder) {
    return <PizzaBuilder />;
  }

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">🍕 Pizza Delivery</div>

        <ul className="nav-links">
          <li onClick={() => {
             window.location.href = "/";
          }}>
             Home
          </li>
          <li onClick={() => {
             window.location.href = "/dashboard";
          }}>
             Menu
          </li>
          <li onClick={() => {
               window.location.href = "/order-tracking";
              }}>
                My Orders
          </li>
          <li onClick={() => setShowRegister(true)}>Register</li>
          <li onClick={() => setShowLogin(true)}>Login</li>
        </ul>
      </nav>

      <section className="hero">
  <button
    className="order-button"
    onClick={() => setShowBuilder(true)}
  >
    Order Pizza
  </button>
</section>

      <section className="pizzas">
        <div className="pizza-section-heading">
  <span>OUR MENU</span>
  <h2>Explore Our Pizzas</h2>
  <p>Freshly made, loaded with flavor.</p>
</div>

        <div className="pizza-container">

  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/margherita.png" alt="Margherita Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Margherita</h3>

      <p>
        Classic cheese and tomato pizza with a delicious Italian-style taste.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹249</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/farmhouse.png" alt="Farmhouse Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Farmhouse</h3>

      <p>
        Fresh vegetables, premium cheese and delicious toppings on every bite.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹299</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/cheese-burst.png" alt="Cheese Burst Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Cheese Burst</h3>

      <p>
        Rich, creamy cheese loaded into every bite for true cheese lovers.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹349</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>

    <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/paneer-tikka.png" alt="Paneer Tikka Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Paneer Tikka</h3>

      <p>
        Juicy paneer tikka with fresh vegetables and Indian-style spices.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹379</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/veggie-supreme.png" alt="Veggie Supreme Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Veggie Supreme</h3>

      <p>
        Loaded with fresh vegetables, olives, peppers and premium cheese.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹329</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/spicy-chicken.png" alt="Spicy Chicken Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Spicy Chicken</h3>

      <p>
        Tender chicken with spicy sauce, vegetables and melted cheese.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹399</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/bbq-chicken.png" alt="BBQ Chicken Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>BBQ Chicken</h3>

      <p>
        Smoky BBQ sauce, tender chicken and melted cheese on a delicious crust.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹429</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>


  <div className="pizza-card">
    <div className="pizza-image">
  <img src="/pizza-images/loaded-cheese.png" alt="Loaded Cheese Pizza" />
</div>

    <div className="pizza-card-content">
      <h3>Loaded Cheese</h3>

      <p>
        Extra cheese blend with a rich, creamy and satisfying cheesy taste.
      </p>

      <div className="pizza-card-bottom">
        <div className="price">₹369</div>

        <button
          className="pizza-customize-button"
          onClick={() => setShowBuilder(true)}
        >
          Customize
        </button>
      </div>
    </div>
  </div>

</div>
      </section>

    </div>
  );
}

export default App;