import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import Contact from './pages/Contact';
import DeliveryReturns from './pages/DeliveryReturns';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
    <ScrollToTop />
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route 
          path="/about" 
          element={<About />} 
          />

          <Route 
          path="/contact" 
          element={<Contact />} 
          />

          <Route
            path="/delivery-returns"
            element={<DeliveryReturns />}
          />

          <Route 
          path="/faq" 
          element={<FAQ />} 
          />
          
          <Route 
          path="/privacy" 
          element={<Privacy />} 
          />

          <Route 
          path="/terms" 
          element={<Terms />} 
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}