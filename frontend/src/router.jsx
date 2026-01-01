import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateArtisanProfile from "./pages/CreateArtisanProfile";
import ArtisanProfile from "./pages/ArtisanProfile";
import HomePage from "./pages/Home";
import ServiceArtisansPage from "./pages/ServiceArtisansPage";
import ArtisanProfileClientPage from "./pages/ArtisanProfileClientPage";
import ArtisanRequestsPage from "./pages/ArtisanRequestsPage";
import ClientRequestsPage from "./pages/ClientRequestsPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/create-profile" element={<CreateArtisanProfile />} />
      <Route path="/artisan-profile/:id" element={<ArtisanProfile />} />
      <Route path="/services/:serviceId" element={<ServiceArtisansPage />} />
      <Route path="/client/artisan/:id" element={<ArtisanProfileClientPage />} />
      <Route path="/artisan/requests" element={<ArtisanRequestsPage />} />
      <Route path="/client/requests" element={<ClientRequestsPage />} />
    </Routes>
  </Router>
);

export default AppRouter;
