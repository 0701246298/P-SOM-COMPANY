require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

/* Stripe Checkout */
app.post("/create-checkout-session", async (req, res) => {
  const { items, currency } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map(item => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: "http://localhost:3000?success=true",
    cancel_url: "http://localhost:3000?canceled=true",
  });

  res.json({ id: session.id });
});

/* Email Invoice */
app.post("/send-invoice", async (req, res) => {
  const { email, items, total } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemList = items.map(i => `${i.name} x${i.quantity}`).join("\n");

  await transporter.sendMail({
    from: "P-Som Company",
    to: email,
    subject: "Your Invoice - P-Som Company",
    text: `Thank you for your purchase.\n\nItems:\n${itemList}\n\nTotal: ${total}`,
  });

  res.json({ message: "Invoice Sent" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));