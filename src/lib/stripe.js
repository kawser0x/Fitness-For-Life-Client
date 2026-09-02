import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key", {
  apiVersion: "2023-10-16",
});
