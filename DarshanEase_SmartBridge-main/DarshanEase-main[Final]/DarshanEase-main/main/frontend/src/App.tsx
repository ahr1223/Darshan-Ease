import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import TempleListPage from "@/pages/TempleListPage";
import TempleDetailsPage from "@/pages/TempleDetailsPage";
import BookingPage from "@/pages/BookingPage";
import SuccessPage from "@/pages/SuccessPage";
import UserDashboard from "@/pages/UserDashboard";
import OrganizerDashboard from "@/pages/OrganizerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import LiveDarshanPage from "@/pages/LiveDarshanPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/temples" element={<TempleListPage />} />
          <Route path="/temple/:id" element={<TempleDetailsPage />} />
          <Route path="/live-darshan" element={<LiveDarshanPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Protected - USER */}
          <Route path="/booking/:templeId/:darshanId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* Protected - ORGANIZER */}
          <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
