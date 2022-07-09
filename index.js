const express = require('express');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const path = require("path");
const app = express();

dotenv.config();

const Publishable_Key = process.env.Publishable_Key;
const Secret_Key = process.env.Secret_Key;

const stripe = require("stripe")(Secret_Key);

const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("Home", { key: Publishable_Key });
})

app.post('/payment', (req, res) => {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Shane West",
      address: {
        line1: "3B Clement Coker way Lagos",
        postal_code: "452221",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 2500,
        description: "NodeJS Course",
        currency: "NGN",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success");
    })
    .catch((err) => {
      res.send(err);
    });
})
app.listen(port, (error) => {
    if (error) throw error
    console.log("Server created Successfully")
});
