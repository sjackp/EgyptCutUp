import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { ServerForm, CarForm, ShopItemForm } from "@/components/admin-forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Server, Car, ShopItem } from "@shared/schema";
import { Settings, Trash2, Edit } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"servers" | "cars" | "shop">("servers");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: servers } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
    enabled: activeTab === "servers" && isAuthenticated,
  });

  const { data: cars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
    enabled: activeTab === "cars" && isAuthenticated,
  });

  const { data: shopItems } = useQuery<ShopItem[]>({
    queryKey: ["/api/shop"],
    enabled: activeTab === "shop" && isAuthenticated,
  });

  const deleteServerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/servers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Success", description: "Server deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete server",
        variant: "destructive",
      });
    },
  });

  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Success", description: "Car deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      });
    },
  });

  const deleteShopItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/shop/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Success", description: "Shop item deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete shop item",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4 bg-yellow-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Panel</h1>
            <p className="text-gray-400">Manage servers, cars, and shop items</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Button
              onClick={() => setActiveTab("servers")}
              className={`admin-tab ${
                activeTab === "servers"
                  ? "bg-racing-red text-white"
                  : "bg-dark-card border border-dark-border text-gray-300"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Manage Servers
            </Button>
            <Button
              onClick={() => setActiveTab("cars")}
              className={`admin-tab ${
                activeTab === "cars"
                  ? "bg-racing-red text-white"
                  : "bg-dark-card border border-dark-border text-gray-300"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Manage Cars
            </Button>
            <Button
              onClick={() => setActiveTab("shop")}
              className={`admin-tab ${
                activeTab === "shop"
                  ? "bg-racing-red text-white"
                  : "bg-dark-card border border-dark-border text-gray-300"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Manage Shop
            </Button>
          </div>

          {/* Servers Tab */}
          {activeTab === "servers" && (
            <div className="space-y-6">
              <Card className="bg-dark-card border-dark-border">
                <CardHeader>
                  <CardTitle className="text-white">Add New Server</CardTitle>
                </CardHeader>
                <CardContent>
                  <ServerForm onSuccess={() => {}} />
                </CardContent>
              </Card>

              {servers && servers.length > 0 && (
                <Card className="bg-dark-card border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-white">Existing Servers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {servers.map((server) => (
                        <div key={server.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                          <div>
                            <h3 className="text-white font-semibold">{server.name}</h3>
                            <p className="text-gray-400 text-sm">{server.region} • {server.currentPlayers}/{server.maxPlayers} players</p>
                            <Badge className={`mt-1 ${
                              server.status === "online" ? "bg-green-500" :
                              server.status === "offline" ? "bg-red-500" : "bg-yellow-500"
                            } text-white`}>
                              {server.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteServerMutation.mutate(server.id)}
                              disabled={deleteServerMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Cars Tab */}
          {activeTab === "cars" && (
            <div className="space-y-6">
              <Card className="bg-dark-card border-dark-border">
                <CardHeader>
                  <CardTitle className="text-white">Add New Car</CardTitle>
                </CardHeader>
                <CardContent>
                  <CarForm onSuccess={() => {}} />
                </CardContent>
              </Card>

              {cars && cars.length > 0 && (
                <Card className="bg-dark-card border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-white">Existing Cars</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {cars.map((car) => (
                        <div key={car.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{car.name}</h3>
                            <p className="text-gray-400 text-sm">{car.make}</p>
                            {car.category !== "standard" && (
                              <Badge className="mt-1 bg-gold-accent text-dark-bg">
                                {car.category}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCarMutation.mutate(car.id)}
                              disabled={deleteCarMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Shop Tab */}
          {activeTab === "shop" && (
            <div className="space-y-6">
              <Card className="bg-dark-card border-dark-border">
                <CardHeader>
                  <CardTitle className="text-white">Add New Shop Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShopItemForm onSuccess={() => {}} />
                </CardContent>
              </Card>

              {shopItems && shopItems.length > 0 && (
                <Card className="bg-dark-card border-dark-border">
                  <CardHeader>
                    <CardTitle className="text-white">Existing Shop Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {shopItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{item.name}</h3>
                            <p className="text-gray-400 text-sm">{item.type} • ${parseFloat(item.price).toFixed(2)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteShopItemMutation.mutate(item.id)}
                              disabled={deleteShopItemMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
