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
import { Trash2, Edit, Plus, Tag, Package } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ShopItem, InsertShopItem } from "@shared/schema";

export function ProductManager() {
  const [selectedProduct, setSelectedProduct] = useState<ShopItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertShopItem>>({
    name: "",
    description: "",
    price: "0",
    category: "sim-related",
    type: "merchandise",
    tags: [],
    materials: [],
    compatibleBrands: [],
    thumbnailUrl: "",
    imageUrl: "",
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/shop"],
  });

  const simProducts = products.filter((p: ShopItem) => p.category === "sim-related");
  const nonSimProducts = products.filter((p: ShopItem) => p.category === "non-sim-related");

  const createMutation = useMutation({
    mutationFn: async (data: InsertShopItem) => {
      return await apiRequest("/api/shop", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Product created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertShopItem> }) => {
      return await apiRequest(`/api/shop/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Product updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/shop/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "0",
      category: "sim-related",
      type: "merchandise",
      tags: [],
      materials: [],
      compatibleBrands: [],
      thumbnailUrl: "",
      imageUrl: "",
      isActive: true,
    });
    setSelectedProduct(null);
  };

  const handleEdit = (product: ShopItem) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "sim-related",
      type: product.type,
      tags: product.tags || [],
      materials: product.materials || [],
      compatibleBrands: product.compatibleBrands || [],
      thumbnailUrl: product.thumbnailUrl || "",
      imageUrl: product.imageUrl || "",
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags,
      materials: typeof formData.materials === 'string' ? formData.materials.split(',').map(m => m.trim()) : formData.materials,
      compatibleBrands: typeof formData.compatibleBrands === 'string' ? formData.compatibleBrands.split(',').map(b => b.trim()) : formData.compatibleBrands,
    } as InsertShopItem;

    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const ProductCard = ({ product }: { product: ShopItem }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-white">{product.name}</CardTitle>
            <p className="text-2xl font-bold text-gold-400 mt-1">${product.price}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(product)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(product.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 text-sm mb-3">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {product.type}
          </Badge>
          {product.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>
        {product.materials && product.materials.length > 0 && (
          <p className="text-xs text-gray-400">Materials: {product.materials.join(", ")}</p>
        )}
        {product.compatibleBrands && product.compatibleBrands.length > 0 && (
          <p className="text-xs text-gray-400">Compatible: {product.compatibleBrands.join(", ")}</p>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-white">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Product Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="sim-related">Sim Related</SelectItem>
                      <SelectItem value="non-sim-related">Non-Sim Related</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="merchandise">Merchandise</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="dlc">DLC</SelectItem>
                      <SelectItem value="pass">Pass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label className="text-white">Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Tags (comma-separated)</Label>
                <Input
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <Label className="text-white">Materials (comma-separated)</Label>
                <Input
                  value={Array.isArray(formData.materials) ? formData.materials.join(", ") : formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="carbon fiber, aluminum, plastic"
                />
              </div>

              <div>
                <Label className="text-white">Compatible Brands (comma-separated)</Label>
                <Input
                  value={Array.isArray(formData.compatibleBrands) ? formData.compatibleBrands.join(", ") : formData.compatibleBrands}
                  onChange={(e) => setFormData({ ...formData, compatibleBrands: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Logitech, Thrustmaster, Fanatec"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label className="text-white">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {selectedProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="sim-related" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="sim-related" className="data-[state=active]:bg-blue-600">
            <Package className="h-4 w-4 mr-2" />
            Sim Related ({simProducts.length})
          </TabsTrigger>
          <TabsTrigger value="non-sim-related" className="data-[state=active]:bg-purple-600">
            <Tag className="h-4 w-4 mr-2" />
            Non-Sim Related ({nonSimProducts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sim-related" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simProducts.map((product: ShopItem) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {simProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No sim-related products found. Add your first product!
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="non-sim-related" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonSimProducts.map((product: ShopItem) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {nonSimProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No non-sim related products found. Add your first product!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}