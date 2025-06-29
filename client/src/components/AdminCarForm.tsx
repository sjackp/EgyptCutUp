import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCarSchema, type Car, type InsertCar } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function AdminCarForm() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: cars, isLoading } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      name: "",
      make: "",
      description: "",
      imageUrl: "",
      downloadUrl: "",
      category: "standard",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCar) => {
      await apiRequest("POST", "/api/cars", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      form.reset();
      toast({
        title: "Success",
        description: "Car created successfully",
      });
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
        description: "Failed to create car",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCar> }) => {
      await apiRequest("PUT", `/api/cars/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setEditingId(null);
      form.reset();
      toast({
        title: "Success",
        description: "Car updated successfully",
      });
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
        description: "Failed to update car",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
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

  const onSubmit = (data: InsertCar) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingId(car.id);
    form.reset({
      name: car.name,
      make: car.make,
      description: car.description || "",
      imageUrl: car.imageUrl || "",
      downloadUrl: car.downloadUrl || "",
      category: car.category || "standard",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this car?")) {
      deleteMutation.mutate(id);
    }
  };

  const carMakes = ["BMW", "Mercedes", "Audi", "Ferrari", "Lotus", "Porsche", "McLaren", "Lamborghini"];

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? "Edit Car" : "Add New Car"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Car Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="e.g., BMW M5 G90"
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
                          <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carMakes.map((make) => (
                            <SelectItem key={make} value={make.toLowerCase()}>
                              {make}
                            </SelectItem>
                          ))}
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
                        className="bg-dark-bg border-dark-border text-white"
                        placeholder="Car description..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="https://..."
                          type="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Download URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="https://..."
                          type="url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-dark-bg border-dark-border text-white">
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
                  className="btn-primary"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId ? (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update Car
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Car
                    </>
                  )}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    onClick={handleCancelEdit}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Cars List */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-white">Existing Cars</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-dark-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cars?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No cars configured yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {cars?.map((car) => (
                <div key={car.id} className="border border-dark-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{car.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {car.make.toUpperCase()} • {car.category}
                      </p>
                      {car.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {car.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(car)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(car.id)}
                        size="sm"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {car.imageUrl && (
                    <img 
                      src={car.imageUrl} 
                      alt={car.name}
                      className="w-full h-32 object-cover rounded mt-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
