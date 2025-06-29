import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Car as CarIcon, Flag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Car, InsertCar } from "@shared/schema";

export function CarManager() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertCar>>({
    name: "",
    make: "",
    year: new Date().getFullYear(),
    horsepower: 0,
    torque: 0,
    weight: 0,
    maxSpeed: 0,
    acceleration: "0",
    description: "",
    imageUrl: "",
    thumbnailUrl: "",
    downloadLink: "",
    category: "standard",
    hasEgyptianPlates: false,
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["/api/cars"],
  });

  const egyptianCars = cars.filter((c: Car) => c.hasEgyptianPlates);
  const internationalCars = cars.filter((c: Car) => !c.hasEgyptianPlates);

  const createMutation = useMutation({
    mutationFn: async (data: InsertCar) => {
      return await apiRequest("/api/cars", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Car created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create car", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCar> }) => {
      return await apiRequest(`/api/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Car updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update car", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/cars/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({ title: "Car deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete car", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      make: "",
      year: new Date().getFullYear(),
      horsepower: 0,
      torque: 0,
      weight: 0,
      maxSpeed: 0,
      acceleration: "0",
      description: "",
      imageUrl: "",
      thumbnailUrl: "",
      downloadLink: "",
      category: "standard",
      hasEgyptianPlates: false,
      isActive: true,
    });
    setSelectedCar(null);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setFormData({
      name: car.name,
      make: car.make,
      year: car.year || new Date().getFullYear(),
      horsepower: car.horsepower || 0,
      torque: car.torque || 0,
      weight: car.weight || 0,
      maxSpeed: car.maxSpeed || 0,
      acceleration: car.acceleration || "0",
      description: car.description || "",
      imageUrl: car.imageUrl || "",
      thumbnailUrl: car.thumbnailUrl || "",
      downloadLink: car.downloadLink || "",
      category: car.category || "standard",
      hasEgyptianPlates: car.hasEgyptianPlates || false,
      isActive: car.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      acceleration: parseFloat(formData.acceleration as string),
    } as InsertCar;

    if (selectedCar) {
      updateMutation.mutate({ id: selectedCar.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const CarCard = ({ car }: { car: Car }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg text-white">{car.name}</CardTitle>
              {car.hasEgyptianPlates && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Flag className="h-3 w-3 mr-1" />
                  Egyptian
                </Badge>
              )}
            </div>
            <p className="text-gold-400 font-semibold">{car.make} • {car.year}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(car)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(car.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-blue-500/10 rounded">
            <p className="text-xs text-gray-400">Power</p>
            <p className="text-sm font-bold text-blue-400">{car.horsepower || 0} HP</p>
          </div>
          <div className="text-center p-2 bg-purple-500/10 rounded">
            <p className="text-xs text-gray-400">Torque</p>
            <p className="text-sm font-bold text-purple-400">{car.torque || 0} Nm</p>
          </div>
          <div className="text-center p-2 bg-yellow-500/10 rounded">
            <p className="text-xs text-gray-400">Weight</p>
            <p className="text-sm font-bold text-yellow-400">{car.weight || 0} kg</p>
          </div>
          <div className="text-center p-2 bg-red-500/10 rounded">
            <p className="text-xs text-gray-400">Top Speed</p>
            <p className="text-sm font-bold text-red-400">{car.maxSpeed || 0} km/h</p>
          </div>
        </div>
        
        {car.acceleration && (
          <div className="text-center p-2 bg-green-500/10 rounded mb-3">
            <p className="text-xs text-gray-400">0-100 km/h</p>
            <p className="text-sm font-bold text-green-400">{car.acceleration}s</p>
          </div>
        )}

        <Badge variant="secondary" className="mb-3">
          {car.category}
        </Badge>
        
        {car.description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{car.description}</p>
        )}
        
        {car.downloadLink && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
            onClick={() => window.open(car.downloadLink, '_blank')}
          >
            Download Car
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-white">Loading cars...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Car Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedCar ? "Edit Car" : "Add New Car"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Car Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="BMW M3 Competition"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Make/Brand</Label>
                  <Input
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="BMW"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Year</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Horsepower (HP)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.horsepower}
                    onChange={(e) => setFormData({ ...formData, horsepower: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Torque (Nm)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.torque}
                    onChange={(e) => setFormData({ ...formData, torque: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Weight (kg)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Max Speed (km/h)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxSpeed}
                    onChange={(e) => setFormData({ ...formData, maxSpeed: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">0-100 km/h (seconds)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.acceleration}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                  placeholder="Detailed description of the car mod..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Thumbnail URL</Label>
                  <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label className="text-white">Full Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Download Link</Label>
                <Input
                  value={formData.downloadLink}
                  onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div>
                <Label className="text-white">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="exclusive">Exclusive</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.hasEgyptianPlates}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasEgyptianPlates: checked })}
                  />
                  <Label className="text-white">Egyptian Street Plates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label className="text-white">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {selectedCar ? "Update" : "Create"} Car
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="international" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="international" className="data-[state=active]:bg-red-600">
            <Car className="h-4 w-4 mr-2" />
            International Cars ({internationalCars.length})
          </TabsTrigger>
          <TabsTrigger value="egyptian" className="data-[state=active]:bg-green-600">
            <Flag className="h-4 w-4 mr-2" />
            Egyptian Street Cars ({egyptianCars.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="international" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {internationalCars.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No international cars found. Add your first car!
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="egyptian" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {egyptianCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          {egyptianCars.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No Egyptian street cars found. Add cars with Egyptian plates!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}