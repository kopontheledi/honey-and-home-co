# Honey & Home Co

React + Vite storefront using Firebase Authentication + Firestore and Cloudinary for product images.

## Setup
1. Copy `.env.example` to `.env` and fill in your Firebase web app values.
2. In Cloudinary create an **unsigned** upload preset called `honey-home-products` (or change the env value).
3. In Firebase enable Email/Password Authentication and create your admin user.
4. Create Firestore Database. Collections `products` and `orders` are created when data is added.
5. Run `npm install` then `npm run dev`.

## Important
Online card/Payflex/PayJustNow/Happy Pay processing is intentionally not faked. Checkout currently records a pending order and shows the R150 website delivery fee. Connect provider merchant credentials/server-side endpoints before accepting live payments. Never put payment secret keys in `VITE_` environment variables.
