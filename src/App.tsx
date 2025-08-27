import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "@/components/Header";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Removed BookPickup and MyPickups imports for release version
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminGuard = lazy(() => import("./components/AdminGuard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Header />
        <div className="h-16" />
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Removed /book-pickup and /my-pickups routes for release version */}
            <Route 
              path="/admin" 
              element={
                <AdminGuard>
                  <Admin />
                </AdminGuard>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
