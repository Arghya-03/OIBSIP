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
          <li>Home</li>
          <li>Menu</li>
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
        <h1>🍕 Delicious Pizza</h1>

        <h2>Delivered Hot to Your Door!</h2>

        <p>
          Choose your favorite pizza and customize it just the way you like.
        </p>

        <button
          className="order-button"
          onClick={() => setShowBuilder(true)}
        >
          Order Pizza
        </button>
      </section>

      <section className="pizzas">
        <h2>Popular Pizzas</h2>

        <div className="pizza-container">

          <div className="pizza-card">
            <div className="pizza-image">🍕</div>
            <h3>Margherita</h3>
            <p>Classic cheese and tomato pizza.</p>
            <div className="price">₹249</div>
          </div>

          <div className="pizza-card">
            <div className="pizza-image">🍕</div>
            <h3>Farmhouse</h3>
            <p>Fresh vegetables with delicious cheese.</p>
            <div className="price">₹299</div>
          </div>

          <div className="pizza-card">
            <div className="pizza-image">🍕</div>
            <h3>Cheese Burst</h3>
            <p>Extra cheese for cheese lovers.</p>
            <div className="price">₹349</div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default App;