// src/App.jsx
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
import MyProfile from "./pages/MyProfile.jsx"; // ✅ Add this
import BrandRequestPage from "./pages/BrandRequestPage.jsx"; // make sure this is imported
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
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

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
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
      </Routes>

    </Router>
    
  );
}
