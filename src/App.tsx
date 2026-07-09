import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import VendorApplication from "./pages/VendorApplication";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSetup from "./pages/AdminSetup";
import VendorDashboard from "./pages/VendorDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import VendorProfile from "./pages/VendorProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LocationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/vendor-application" element={<VendorApplication />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/vendor/:id" element={<VendorProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LocationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
