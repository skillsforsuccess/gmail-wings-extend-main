import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CRMProvider } from "@/context/CRMContext";
import AppLayout from "@/components/AppLayout";
import PipelinePage from "@/pages/Pipeline";
import ContactsPage from "@/pages/Contacts";
import AnalyticsPage from "@/pages/Analytics";
import PopupMockup from "@/pages/PopupMockup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CRMProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<PipelinePage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/popup" element={<PopupMockup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </CRMProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
