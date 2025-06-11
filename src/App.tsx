
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatGPTProvider } from "@/contexts/ChatGPTContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EmailConfirmed from "./pages/EmailConfirmed";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/Subscription";
import Homepage from "./pages/marketing/Homepage";
import Features from "./pages/marketing/Features";
import UseCases from "./pages/marketing/UseCases";
import Differentiators from "./pages/marketing/Differentiators";
import Pricing from "./pages/marketing/Pricing";
import Blog from "./pages/marketing/Blog";
import About from "./pages/marketing/About";
import Careers from "./pages/marketing/Careers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <ChatGPTProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/app" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/email-confirmed" element={<EmailConfirmed />} />
                
                {/* Marketing Website Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/features" element={<Features />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/differentiators" element={<Differentiators />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<About />} />
                <Route path="/careers" element={<Careers />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ChatGPTProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
