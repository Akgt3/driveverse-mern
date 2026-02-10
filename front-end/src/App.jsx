import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/* USER LAYOUT */
import Header from "./pages/Header";
import Footer from "./pages/Footer";

/* USER PAGES */
import Landing from "./pages/Landing";
import Buy from "./pages/Buy";
import VehicleDetails from "./pages/VehicleDetails";
import Careers from "./pages/Careers";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Sell from "./pages/Sell";
import MyAds from "./pages/MyAds";
import EditAd from "./pages/EditAd";
import Help from "./pages/Help";
import Settings from "./pages/Settings";


/* CHAT + AUTH */
import Chat from "./pages/Chat";
import ChatInbox from "./pages/ChatInbox";
import Auth from "./pages/Auth";
import Preloader from "./pages/Preloader";

/* ADMIN PAGES */
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminListings from "./admin/pages/AdminListings";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminRoute from "./admin/AdminRoute";


export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5200);
    return () => clearTimeout(timer);
  }, []);

  /* 🔒 HIDE USER HEADER + FOOTER */
  const hideUserLayout =
    location.pathname === "/auth" ||
    location.pathname.startsWith("/chat/") ||
    location.pathname.startsWith("/admin"); // ✅ admin excluded

  if (loading) return <Preloader />;

  return (
    <div className="min-h-screen transition-colors">
      {/* USER HEADER */}
      {!hideUserLayout && <Header />}

      <Routes>
        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/buy/:id" element={<VehicleDetails />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/my-ads" element={<MyAds />} />
        <Route path="/edit-ad/:id" element={<EditAd />} />
        <Route path="/help" element={<Help />} />
        <Route
          path="/settings"
          element={
            <Settings />
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <AdminRoute>
              <AdminListings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />


        {/* ================= AUTH ================= */}
        <Route path="/auth" element={<Auth />} />

        {/* ================= CHAT ================= */}
        <Route path="/chat" element={<ChatInbox />} />
        <Route path="/chat/:sellerId" element={<Chat />} />
      </Routes>

      {/* USER FOOTER */}
      {!hideUserLayout && <Footer />}
    </div >
  );
}
