const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "EK5veDQ87Yx8DV9qoHvSthShuQzJTewAmTLSAUp1WvDHy5hTb1GdRKyCkfBOWgIft_1GrR3ELpZPgbam",
  client_secret: "EK5veDQ87Yx8DV9qoHvSthShuQzJTewAmTLSAUp1WvDHy5hTb1GdRKyCkfBOWgIft_1GrR3ELpZPgbam",
});

module.exports = paypal;
