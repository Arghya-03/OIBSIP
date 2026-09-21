require("dotenv").config();
const cron = require("node-cron");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

const Order = require("./models/Order");
const User = require("./models/User");
const Admin = require("./models/Admin");
const Inventory = require("./models/Inventory");

const bcrypt = require("bcryptjs");
const transporter = require("./utils/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const { default: mongoose } = require("mongoose");

const app = express();

const PORT = 5000;

// --------------------------------------------------
// RAZORPAY
// --------------------------------------------------

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// DATABASE
// --------------------------------------------------

connectDB();

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

const verifyUserToken = (req) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new Error("Authorization token is required.");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyAdminToken = (req) => {
  const decoded = verifyUserToken(req);

  if (decoded.role !== "admin") {
    throw new Error("Admin access required.");
  }

  return decoded;
};

// --------------------------------------------------
// HOME ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.send("🍕 Pizza Delivery Backend is Working!");
});

// --------------------------------------------------
// TEST ROUTE
// --------------------------------------------------

app.post("/api/test", (req, res) => {
  console.log("Data received:", req.body);

  res.json({
    message: "Backend received the data successfully!",
    data: req.body,
  });
});

// ==================================================
// ADMIN SECTION
// ==================================================

// --------------------------------------------------
// CREATE ADMIN
// --------------------------------------------------
// Temporary route for creating the first admin.
// Do not keep this publicly available in production.


// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------



app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid admin email or password.",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Admin login successful!",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      message: "Admin login failed.",
    });
  }
});

// --------------------------------------------------
// ADMIN - CREATE INVENTORY ITEM
// --------------------------------------------------

app.post("/api/admin/inventory", async (req, res) => {
  try {
    verifyAdminToken(req);

    const {
      name,
      category,
      stock,
      lowStockThreshold,
    } = req.body;

    if (!name || !category || stock === undefined) {
      return res.status(400).json({
        message: "Name, category and stock are required.",
      });
    }

    if (
      Number.isNaN(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        message: "Stock must be a valid number.",
      });
    }

    const existingItem = await Inventory.findOne({
      name: name.trim(),
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Inventory item already exists.",
      });
    }

    const item = new Inventory({
      name: name.trim(),
      category,
      stock: Number(stock),
      lowStockThreshold:
        lowStockThreshold !== undefined
          ? Number(lowStockThreshold)
          : 20,
    });

    await item.save();

    res.status(201).json({
      message: "Inventory item created successfully!",
      item,
    });
  } catch (error) {
    console.error(
      "Inventory creation error:",
      error.message
    );

    if (error.message === "Admin access required.") {
      return res.status(403).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "Authorization token is required."
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Could not create inventory item.",
    });
  }
});

// --------------------------------------------------
// ADMIN - GET INVENTORY
// --------------------------------------------------

app.get("/api/admin/inventory", async (req, res) => {
  try {
    verifyAdminToken(req);

    const inventory = await Inventory.find().sort({
      category: 1,
      name: 1,
    });

    res.json({
      inventory,
    });
  } catch (error) {
    console.error(
      "Inventory fetch error:",
      error.message
    );

    if (error.message === "Admin access required.") {
      return res.status(403).json({
        message: error.message,
      });
    }

    res.status(401).json({
      message: "Invalid or expired admin token.",
    });
  }
});

// --------------------------------------------------
// ADMIN - UPDATE STOCK
// --------------------------------------------------

app.put(
  "/api/admin/inventory/:id",
  async (req, res) => {
    try {
      verifyAdminToken(req);

      const { stock } = req.body;

      if (
        stock === undefined ||
        Number.isNaN(Number(stock)) ||
        Number(stock) < 0
      ) {
        return res.status(400).json({
          message: "Valid stock value is required.",
        });
      }

      const item =
        await Inventory.findByIdAndUpdate(
          req.params.id,
          {
            stock: Number(stock),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!item) {
        return res.status(404).json({
          message: "Inventory item not found.",
        });
      }

      res.json({
        message: "Stock updated successfully!",
        item,
      });
    } catch (error) {
      console.error(
        "Stock update error:",
        error.message
      );

      if (
        error.message ===
        "Admin access required."
      ) {
        return res.status(403).json({
          message: error.message,
        });
      }

      res.status(401).json({
        message: "Invalid or expired admin token.",
      });
    }
  }
);

// ==================================================
// USER REGISTRATION
// ==================================================

app.post("/api/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();

    const verificationLink =
      `http://localhost:5173/verify/${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: normalizedEmail,
      subject:
        "🍕 Verify Your Pizza Delivery Account",

      html: `
        <h2>Welcome to Pizza Delivery!</h2>

        <p>Hi ${name},</p>

        <p>
          Thank you for creating your account.
        </p>

        <p>
          Please click the button below
          to verify your email address.
        </p>

        <a
          href="${verificationLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#d62828;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Verify Email
        </a>

        <p>
          If you did not create this account,
          you can ignore this email.
        </p>
      `,
    });

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      message:
        "Registration failed. Please try again.",
    });
  }
});

// ==================================================
// VERIFY EMAIL
// ==================================================

app.get(
  "/api/verify/:token",
  async (req, res) => {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        verificationToken: token,
      });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid or expired verification link.",
        });
      }

      user.isVerified = true;
      user.verificationToken = null;

      await user.save();

      res.json({
        message:
          "Email verified successfully! You can now login.",
      });
    } catch (error) {
      console.error(
        "Email verification error:",
        error.message
      );

      res.status(500).json({
        message:
          "Email verification failed.",
      });
    }
  }
);

// ==================================================
// USER LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      message: "Login failed.",
    });
  }
});

// ==================================================
// FORGOT PASSWORD
// ==================================================

app.post(
  "/api/forgot-password",
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required.",
        });
      }

      const normalizedEmail =
        email.toLowerCase().trim();

      const user = await User.findOne({
        email: normalizedEmail,
      });

      if (!user) {
        return res.status(404).json({
          message:
            "No account found with this email.",
        });
      }

      const resetToken =
        crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpires =
        Date.now() + 15 * 60 * 1000;

      await user.save();

      const resetLink =
        `http://localhost:5173/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject:
          "🍕 Reset Your Pizza Delivery Password",

        html: `
          <h2>Password Reset</h2>

          <p>Hi ${user.name},</p>

          <p>
            We received a request to reset
            your password.
          </p>

          <p>
            Click the button below to create
            a new password.
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#d62828;
              color:white;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request this,
            you can ignore this email.
          </p>
        `,
      });

      res.json({
        message:
          "Password reset link sent to your email.",
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not send password reset email.",
      });
    }
  }
);

// ==================================================
// RESET PASSWORD
// ==================================================

app.post(
  "/api/reset-password",
  async (req, res) => {
    try {
      const {
        token,
        password,
      } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          message:
            "Token and new password are required.",
        });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid or expired password reset link.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      user.password = hashedPassword;

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.json({
        message:
          "Password reset successfully!",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not reset password.",
      });
    }
  }
);

// ==================================================
// CREATE RAZORPAY ORDER
// ==================================================

app.post(
  "/api/payment/create-order",
  async (req, res) => {
    try {
      const decoded =
        verifyUserToken(req);

      const {
        amount,
        size,
        base,
        sauce,
        cheese,
        toppings = [],
      } = req.body;

      if (!amount) {
        return res.status(400).json({
          message:
            "Amount is required.",
        });
      }

      if (
        !size ||
        !base ||
        !sauce ||
        !cheese
      ) {
        return res.status(400).json({
          message:
            "Size, base, sauce and cheese are required.",
        });
      }

      const options = {
        amount:
          Number(amount) * 100,

        currency: "INR",

        receipt:
          `pizza_${Date.now()}`,
      };

      const razorpayOrder =
        await razorpay.orders.create(
          options
        );

      const newOrder =
        new Order({
          userId: decoded.userId,

          size,

          base,

          sauce,

          cheese,

          toppings,

          razorpayOrderId:
            razorpayOrder.id,

          paymentStatus:
            "Pending",

          status:
            "Order Received",

          inventoryDeducted:
            false,
        });

      await newOrder.save();

      res.json({
        message:
          "Razorpay order created successfully!",

        razorpayOrderId:
          razorpayOrder.id,

        order:
          razorpayOrder,
      });
    } catch (error) {
      console.error(
        "Razorpay order error:",
        error.message
      );

      res.status(500).json({
        message:
          "Could not create Razorpay order.",
      });
    }
  }
);

// ==================================================
// VERIFY RAZORPAY PAYMENT
// + DEDUCT INVENTORY
// ==================================================

app.post(
  "/api/payment/verify",
  async (req, res) => {
    try {
      const decoded =
        verifyUserToken(req);

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      // --------------------------------------------
      // Check payment data
      // --------------------------------------------

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Payment details are incomplete.",
        });
      }

      // --------------------------------------------
      // Generate Razorpay signature
      // --------------------------------------------

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
          )
          .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
          )
          .digest("hex");

      // --------------------------------------------
      // Compare signatures
      // --------------------------------------------

      if (
        generatedSignature !==
        razorpay_signature
      ) {
        return res.status(400).json({
          message:
            "Invalid payment signature.",
        });
      }

      // --------------------------------------------
      // Find order
      // --------------------------------------------

      const order =
        await Order.findOne({
          razorpayOrderId:
            razorpay_order_id,

          userId:
            decoded.userId,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found.",
        });
      }

      // --------------------------------------------
      // Deduct inventory only once
      // --------------------------------------------

      if (!order.inventoryDeducted) {
        const ingredients = [
          order.base,
          order.sauce,
          order.cheese,
          ...(order.toppings || []),
        ];

        for (
          const ingredient
          of ingredients
        ) {
          const inventoryItem =
            await Inventory.findOne({
              name: ingredient,
            });

          if (!inventoryItem) {
            console.warn(
              `Inventory item not found: ${ingredient}`
            );

            continue;
          }

          if (
            inventoryItem.stock > 0
          ) {
            inventoryItem.stock -= 1;

            await inventoryItem.save();

            console.log(
              `Inventory reduced: ${ingredient}`
            );
          } else {
            console.warn(
              `Inventory out of stock: ${ingredient}`
            );
          }
        }

        order.inventoryDeducted =
          true;
      }

      // --------------------------------------------
      // Mark payment as paid
      // --------------------------------------------

      order.paymentStatus =
        "Paid";

      await order.save();

      io.to(`order-${order._id}`).emit("orderStatusUpdated", {
         orderId: order._id,
        status: order.status,
      });

      

      res.json({
        message:
          "Payment verified and inventory updated successfully!",

        order,
      });
    } catch (error) {
      console.error(
        "Payment verification error:",
        error.message
      );

      res.status(500).json({
        message:
          "Payment verification failed.",
      });
    }
  }
);

// ==================================================
// NORMAL ORDER ROUTE
// ==================================================
// Kept for compatibility with the project.

app.post(
  "/api/orders",
  async (req, res) => {
    try {
      const decoded =
        verifyUserToken(req);

      const {
        size,
        base,
        sauce,
        cheese,
        toppings = [],
      } = req.body;

      if (
        !size ||
        !base ||
        !sauce ||
        !cheese
      ) {
        return res.status(400).json({
          message:
            "Size, base, sauce and cheese are required.",
        });
      }

      const newOrder =
        new Order({
          userId:
            decoded.userId,

          size,

          base,

          sauce,

          cheese,

          toppings,

          status:
            "Order Received",

          paymentStatus:
            "Pending",
        });

      const savedOrder =
        await newOrder.save();

      res.status(201).json({
        message:
          "Order saved successfully!",

        order:
          savedOrder,
      });
    } catch (error) {
      console.error(
        "Order save error:",
        error.message
      );

      res.status(401).json({
        message:
          "Invalid or expired login token.",
      });
    }
  }
);

// ==================================================
// GET LATEST USER ORDER
// ==================================================

app.get(
  "/api/orders/latest",
  async (req, res) => {
    

    try {
      const decoded =
        verifyUserToken(req);

      const order =
        await Order.findOne({
          userId:
            decoded.userId,
        }).sort({
          createdAt: -1,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "No order found.",
        });
      }

      res.json({
        order,
      });
    } catch (error) {
      console.error(
        "Latest order error:",
        error.message
      );

      res.status(401).json({
        message:
          "Invalid or expired login token.",
      });
    }
  }
);

// ==================================================
// ADMIN - GET ALL ORDERS
// ==================================================

app.get(
  "/api/admin/orders",
  async (req, res) => {
    try {
      verifyAdminToken(req);

      const orders =
        await Order.find()
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        orders,
      });
    } catch (error) {
      console.error(
        "Admin orders error:",
        error.message
      );

      if (
        error.message ===
        "Admin access required."
      ) {
        return res.status(403).json({
          message:
            error.message,
        });
      }

      res.status(401).json({
        message:
          "Invalid or expired admin token.",
      });
    }
  }
);

// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

app.put(
  "/api/admin/orders/:id/status",
  async (req, res) => {
    try {
      verifyAdminToken(req);

      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "Order Received",
        "In Kitchen",
        "Sent to Delivery",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid order status.",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found.",
        });
      }

      order.status =
        status;

      await order.save();

      io.to(`order-${order._id}`).emit("orderStatusUpdated", {
         orderId: order._id,
        status: order.status,
      });

      

      res.json({
        message:
          "Order status updated successfully!",

        order,
      });
    } catch (error) {
      console.error(
        "Order status update error:",
        error.message
      );

      if (
        error.message ===
        "Admin access required."
      ) {
        return res.status(403).json({
          message:
            error.message,
        });
      }

      res.status(401).json({
        message:
          "Invalid or expired admin token.",
      });
    }
  }
);


// ==================================================
// LOW STOCK EMAIL NOTIFICATION
// ==================================================

cron.schedule("* * * * *", async () => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: {
        $lte: ["$stock", "$lowStockThreshold"],
      },
    });

    if (lowStockItems.length === 0) {
      return;
    }

    console.log("⚠️ Low stock items found:");

    lowStockItems.forEach((item) => {
      console.log(
        `${item.name}: ${item.stock} remaining`
      );
    });

    const itemList = lowStockItems
      .map(
        (item) =>
          `<li><strong>${item.name}</strong>: ${item.stock} remaining (threshold: ${item.lowStockThreshold})</li>`
      )
      .join("");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "⚠️ Pizza Delivery - Low Stock Alert",

      html: `
        <h2>⚠️ Low Stock Alert</h2>

        <p>
          The following inventory items have reached
          or fallen below their configured threshold:
        </p>

        <ul>
          ${itemList}
        </ul>

        <p>
          Please update the inventory when required.
        </p>
      `,
    });

    console.log(
      "📧 Low stock notification email sent successfully!"
    );
  } catch (error) {
    console.error(
      "Low stock email error:",
      error.message
    );
  }
});


// ==================================================
// SOCKET.IO SERVER
// ==================================================

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(
    "🔌 User connected to Socket.IO:",
    socket.id
  );

  socket.on("joinOrderRoom", (orderId) => {
  socket.join(`order-${orderId}`);
  console.log(`📦 Joined order room: order-${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log(
      "🔌 User disconnected:",
      socket.id
    );
  });
});

// ==================================================
// START SERVER
// ==================================================

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);



