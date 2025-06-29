import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2, Edit, Plus, Server as ServerIcon, Car as CarIcon, Package, Crown } from "lucide-react";
import type { Server, Car, ShopItem, InsertServer, InsertCar, InsertShopItem } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServerSchema, insertCarSchema, insertShopItemSchema } from "@shared/schema";

// Form Components
function ServerForm({ onSubmit }: { onSubmit: (data: InsertServer) => void }) {
  const form = useForm<InsertServer>({
    resolver: zodResolver(insertServerSchema),
    defaultValues: {
      name: "",
      region: "",
      description: "",
      imageUrl: "",
      status: "online",
      playerCount: 0,
      maxPlayers: 100,
    },
  });

  const handleSubmit = (data: InsertServer) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Server Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Region</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image URL</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create Server
        </Button>
      </form>
    </Form>
  );
}

function CarForm({ onSubmit }: { onSubmit: (data: InsertCar) => void }) {
  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      name: "",
      make: "",
      year: new Date().getFullYear(),
      category: "sports",
      description: "",
      imageUrl: "",
      downloadUrl: "",
      tags: [],
      hasEgyptianPlates: false,
      isActive: true,
    },
  });

  const handleSubmit = (data: InsertCar) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Car Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Make</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="drift">Drift</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Download URL</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create Car
        </Button>
      </form>
    </Form>
  );
}

function ShopForm({ onSubmit }: { onSubmit: (data: InsertShopItem) => void }) {
  const form = useForm<InsertShopItem>({
    resolver: zodResolver(insertShopItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "sim-related",
      imageUrl: "",
      isActive: true,
    },
  });

  const handleSubmit = (data: InsertShopItem) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Product Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Price</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="sim-related">Sim-Related</SelectItem>
                  <SelectItem value="non-sim-related">Non-Sim Related</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create Product
        </Button>
      </form>
    </Form>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("servers");
  const [showServerForm, setShowServerForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showShopForm, setShowShopForm] = useState(false);

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

  // Queries
  const { data: servers = [] } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
    enabled: isAuthenticated,
  });

  const { data: cars = [] } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
    enabled: isAuthenticated,
  });

  const { data: shopItems = [] } = useQuery<ShopItem[]>({
    queryKey: ["/api/shop"],
    enabled: isAuthenticated,
  });

  // Delete mutations
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

  // Create mutations
  const createServerMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/servers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Success", description: "Server created successfully" });
      setShowServerForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create server",
        variant: "destructive",
      });
    },
  });

  const createCarMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/cars", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Success", description: "Car created successfully" });
      setShowCarForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create car",
        variant: "destructive",
      });
    },
  });

  const createShopItemMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/shop", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Success", description: "Shop item created successfully" });
      setShowShopForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create shop item",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage servers, cars, and shop items for EGCU Racing Community</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              <ServerIcon className="h-3 w-3 mr-1" />
              {servers.length} Servers
            </Badge>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
              <CarIcon className="h-3 w-3 mr-1" />
              {cars.length} Cars
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <Package className="h-3 w-3 mr-1" />
              {shopItems.length} Shop Items
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-8">
            <TabsTrigger value="servers" className="data-[state=active]:bg-blue-600">
              <ServerIcon className="h-4 w-4 mr-2" />
              Servers
            </TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-red-600">
              <CarIcon className="h-4 w-4 mr-2" />
              Cars
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-green-600">
              <Package className="h-4 w-4 mr-2" />
              Shop
            </TabsTrigger>
          </TabsList>

          {/* Servers Tab */}
          <TabsContent value="servers">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Server Management
                  <Dialog open={showServerForm} onOpenChange={setShowServerForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Server
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New Server</DialogTitle>
                      </DialogHeader>
                      <ServerForm onSubmit={createServerMutation.mutate} />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servers.map((server) => (
                    <Card key={server.id} className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          {server.name}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
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
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong>Region:</strong> {server.region}</p>
                          <p><strong>Players:</strong> {server.currentPlayers}/{server.maxPlayers}</p>
                          <p><strong>Status:</strong> 
                            <Badge className={server.status === 'online' ? 'bg-green-500/20 text-green-400 ml-2' : 'bg-red-500/20 text-red-400 ml-2'}>
                              {server.status}
                            </Badge>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cars Tab */}
          <TabsContent value="cars">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Car Management
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Car
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <Card key={car.id} className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          {car.name}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
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
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong>Make:</strong> {car.make}</p>
                          <p><strong>Year:</strong> {car.year}</p>
                          {car.horsepower && <p><strong>HP:</strong> {car.horsepower}</p>}
                          {car.hasEgyptianPlates && (
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              Egyptian Plates
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Shop Management
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopItems.map((item) => (
                    <Card key={item.id} className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          {item.name}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
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
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><strong>Price:</strong> ${item.price}</p>
                          <p><strong>Category:</strong> {item.category}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}