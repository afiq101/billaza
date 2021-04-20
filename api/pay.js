const stripe = require("stripe")(
  "sk_test_51Ig0fgGunXd2RLUSq4jMYI7uNaZ3p7qSRhBQh7DvxeTllsI09mH8OI7Zjt5IjHKjcGVajj0bYN4UW1o1HKDvkM6u00LKsllyAS"
);

const express = require("express");
const router = express.Router();

const YOUR_DOMAIN = "http://localhost:3000";

router.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "myr",
          product_data: {
            name: req.body.name,
            images: ["https://i.imgur.com/0udGDdc.png"],
          },
          unit_amount: req.body.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });
  res.json({ id: session.id });
});

module.exports = router;
