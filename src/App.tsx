import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuthStore } from "@/store/authStore";
import Dashboard from "./pages/Dashboard";
import UsernameSearch from "./pages/UsernameSearch";
import EmailInvestigation from "./pages/EmailInvestigation";
import PhoneNumber from "./pages/PhoneNumber";
import WebScraping from "./pages/WebScraping";
import SocialMedia from "./pages/SocialMedia";
import BreachData from "./pages/BreachData";
import DarkWeb from "./pages/DarkWeb";
import History from "./pages/History";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="username" element={<UsernameSearch />} />
            <Route path="email" element={<EmailInvestigation />} />
            <Route path="phone" element={<PhoneNumber />} />
            <Route path="webscraping" element={<WebScraping />} />
            <Route path="socialmedia" element={<SocialMedia />} />
            <Route path="breach" element={<BreachData />} />
            <Route path="darkweb" element={<DarkWeb />} />
            <Route path="history" element={<History />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
