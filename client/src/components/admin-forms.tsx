import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertServerSchema, insertCarSchema, insertShopItemSchema, type InsertServer, type InsertCar, type InsertShopItem } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function ServerForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertServer>({
    resolver: zodResolver(insertServerSchema),
    defaultValues: {
      name: "",
      region: "",
      maxPlayers: 32,
      currentPlayers: 0,
      trafficDensity: 50,
      track: "",
      availableVipSlots: 0,
      joinLink: "",
      bannerUrl: "",
      status: "offline",
      gameMode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertServer) => {
      await apiRequest("POST", "/api/servers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Success", description: "Server created successfully" });
      form.reset();
      onSuccess();
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
        description: error.message || "Failed to create server",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertServer) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Server Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., EGCU Main Server"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
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
                <FormLabel className="text-gray-300">Region</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 🇪🇬 Egypt"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxPlayers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Max Players</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-dark-bg border-dark-border text-white focus:border-racing-red">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="track"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Track</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Cairo Ring Road"
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="trafficDensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Traffic Density (%)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    max="100"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableVipSlots"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Available VIP Slots</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Banner URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joinLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Join Link</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-racing-red hover:bg-red-700 text-white"
          >
            {mutation.isPending ? "Creating..." : "Create Server"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CarForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      name: "",
      make: "",
      year: new Date().getFullYear(),
      thumbnail: "",
      description: "",
      horsepower: undefined,
      torque: undefined,
      weight: undefined,
      maxSpeed: undefined,
      acceleration: undefined,
      downloadLink: "",
      category: "standard",
      isActive: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCar) => {
      await apiRequest("POST", "/api/cars", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Success", description: "Car created successfully" });
      form.reset();
      onSuccess();
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
        description: error.message || "Failed to create car",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCar) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Car Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., BMW M5 G90"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
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
                <FormLabel className="text-gray-300">Make</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-dark-bg border-dark-border text-white focus:border-racing-red">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes">Mercedes</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="Ferrari">Ferrari</SelectItem>
                    <SelectItem value="Lotus">Lotus</SelectItem>
                    <SelectItem value="Porsche">Porsche</SelectItem>
                    <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                    <SelectItem value="McLaren">McLaren</SelectItem>
                    <SelectItem value="Ford">Ford</SelectItem>
                    <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="Nissan">Nissan</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Year</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Thumbnail URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
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
              <FormLabel className="text-gray-300">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Car description..."
                  rows={3}
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="horsepower"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Horsepower (HP)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="torque"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Torque (Nm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxSpeed"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Max Speed (km/h)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceleration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">0-100 km/h (seconds)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="downloadLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Download Link</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://..."
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
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
              <FormLabel className="text-gray-300">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-dark-bg border-dark-border text-white focus:border-racing-red">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-racing-red hover:bg-red-700 text-white"
          >
            {mutation.isPending ? "Creating..." : "Create Car"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ShopItemForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertShopItem>({
    resolver: zodResolver(insertShopItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0.00",
      type: "merchandise",
      iconClass: "fas fa-tshirt",
      isActive: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertShopItem) => {
      await apiRequest("POST", "/api/shop", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Success", description: "Shop item created successfully" });
      form.reset();
      onSuccess();
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
        description: error.message || "Failed to create shop item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertShopItem) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Item Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., EGCU Racing T-Shirt"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-dark-bg border-dark-border text-white focus:border-racing-red">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="dlc">DLC</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Item description..."
                  rows={3}
                  className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., 25.99"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iconClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Icon Class</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., fas fa-tshirt"
                    className="bg-dark-bg border-dark-border text-white focus:border-racing-red"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-racing-red hover:bg-red-700 text-white"
          >
            {mutation.isPending ? "Creating..." : "Create Item"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}
