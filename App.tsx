import React from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Sale } from './pages/Sale';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CarDetail } from './pages/CarDetail';
import { Favorites } from './pages/Favorites';
import { Financing } from './pages/Financing';
import { TradeIn } from './pages/TradeIn';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCars } from './pages/AdminCars';
import { AdminPurchaseRequests } from './pages/AdminPurchaseRequests';
import { AdminQRCodes } from './pages/AdminQRCodes';
import { AdminUsers } from './pages/AdminUsers';
import { QRRedirect } from './pages/QRRedirect';
import { AdminLayout } from './components/AdminLayout';
import { AdminGuard } from './components/AdminGuard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = () => (
  <Layout>
    <ScrollToTop />
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cars/:slug" element={<CarDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/trade-in" element={<TradeIn />} />
        </Route>

        {/* QR Code Redirect (No Layout to render faster) */}
        <Route path="/qr/:id" element={<QRRedirect />} />

        {/* Admin Login (Unprotected) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="purchase-requests" element={<AdminPurchaseRequests />} />
            <Route path="qr-codes" element={<AdminQRCodes />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;