import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import OAuth2RedirectHandler from "./pages/OAuth2RedirectHandler.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Navbar from "./pages/Navbar.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import BrandRequestPage from "./pages/BrandRequestPage.jsx";
import BrandRequestsAdmin from "./pages/BrandRequestsAdmin.jsx";
import BrandSeller from "./pages/BrandSeller.jsx";
import ProductEdit from "./pages/ProductEdit.jsx";
import ProductCreate from "./pages/ProductCreate.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import BrandOrders from "./pages/BrandOrders.jsx";

/** You said these are already created */
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

/** New: My Orders page */
import MyOrders from "./pages/MyOrders.jsx";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public catalog + product page */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/p/:id" element={<ProductDetails />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MyProfile />
            </PrivateRoute>
          }
        />

        {/* New: My Orders (protected) */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/request-brand"
          element={
            <PrivateRoute>
              <BrandRequestPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-brand"
          element={
            <PrivateRoute>
              <BrandSeller />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-brand/products/create"
          element={
            <PrivateRoute>
              <ProductCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-brand/products/:productId/edit"
          element={
            <PrivateRoute>
              <ProductEdit />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/brand-requests"
          element={
            <AdminRoute>
              <BrandRequestsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/my-brand/orders"
          element={
            <PrivateRoute>
              <BrandOrders />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
      </Routes>
    </Router>
  );
}
