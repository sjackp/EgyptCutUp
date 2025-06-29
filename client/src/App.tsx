import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Servers from "@/pages/servers";
import Cars from "@/pages/cars";
import Discord from "@/pages/discord";
import Shop from "@/pages/shop";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading ? (
        <Route path="/" component={() => <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>} />
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/servers" component={Servers} />
          <Route path="/cars" component={Cars} />
          <Route path="/discord" component={Discord} />
          <Route path="/shop" component={Shop} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/servers" component={Servers} />
          <Route path="/cars" component={Cars} />
          <Route path="/discord" component={Discord} />
          <Route path="/shop" component={Shop} />
          <Route path="/admin" component={Admin} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
