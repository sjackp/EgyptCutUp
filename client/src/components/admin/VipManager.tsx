import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Crown, Star, Gift } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VipTier {
  id: number;
  name: string;
  price: string;
  duration: number;
  benefits: string[];
  perks: string[];
  priority: number;
  isActive: boolean;
}

interface InsertVipTier {
  name: string;
  price: string;
  duration: number;
  benefits: string[];
  perks: string[];
  priority: number;
  isActive: boolean;
}

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

interface InsertPromoCode {
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  usageLimit?: number;
  validFrom?: string;
  validUntil?: string;
  isActive: boolean;
}

export function VipManager() {
  const [selectedTier, setSelectedTier] = useState<VipTier | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  
  const [tierFormData, setTierFormData] = useState<Partial<InsertVipTier>>({
    name: "",
    price: "0",
    duration: 30,
    benefits: [],
    perks: [],
    priority: 0,
    isActive: true,
  });

  const [promoFormData, setPromoFormData] = useState<Partial<InsertPromoCode>>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "0",
    usageLimit: 100,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: "",
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vipTiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ["/api/vip-tiers"],
  });

  const { data: promoCodes = [], isLoading: promosLoading } = useQuery({
    queryKey: ["/api/promo-codes"],
  });

  // VIP Tier mutations
  const createTierMutation = useMutation({
    mutationFn: async (data: InsertVipTier) => {
      return await apiRequest("/api/vip-tiers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vip-tiers"] });
      toast({ title: "VIP tier created successfully" });
      setIsTierDialogOpen(false);
      resetTierForm();
    },
    onError: () => {
      toast({ title: "Failed to create VIP tier", variant: "destructive" });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertVipTier> }) => {
      return await apiRequest(`/api/vip-tiers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vip-tiers"] });
      toast({ title: "VIP tier updated successfully" });
      setIsTierDialogOpen(false);
      resetTierForm();
    },
    onError: () => {
      toast({ title: "Failed to update VIP tier", variant: "destructive" });
    },
  });

  const deleteTierMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/vip-tiers/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vip-tiers"] });
      toast({ title: "VIP tier deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete VIP tier", variant: "destructive" });
    },
  });

  // Promo Code mutations
  const createPromoMutation = useMutation({
    mutationFn: async (data: InsertPromoCode) => {
      return await apiRequest("/api/promo-codes", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promo-codes"] });
      toast({ title: "Promo code created successfully" });
      setIsPromoDialogOpen(false);
      resetPromoForm();
    },
    onError: () => {
      toast({ title: "Failed to create promo code", variant: "destructive" });
    },
  });

  const updatePromoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPromoCode> }) => {
      return await apiRequest(`/api/promo-codes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promo-codes"] });
      toast({ title: "Promo code updated successfully" });
      setIsPromoDialogOpen(false);
      resetPromoForm();
    },
    onError: () => {
      toast({ title: "Failed to update promo code", variant: "destructive" });
    },
  });

  const deletePromoMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/promo-codes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/promo-codes"] });
      toast({ title: "Promo code deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete promo code", variant: "destructive" });
    },
  });

  const resetTierForm = () => {
    setTierFormData({
      name: "",
      price: "0",
      duration: 30,
      benefits: [],
      perks: [],
      priority: 0,
      isActive: true,
    });
    setSelectedTier(null);
  };

  const resetPromoForm = () => {
    setPromoFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "0",
      usageLimit: 100,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: "",
      isActive: true,
    });
    setSelectedPromo(null);
  };

  const handleEditTier = (tier: VipTier) => {
    setSelectedTier(tier);
    setTierFormData({
      name: tier.name,
      price: tier.price,
      duration: tier.duration,
      benefits: tier.benefits,
      perks: tier.perks,
      priority: tier.priority,
      isActive: tier.isActive,
    });
    setIsTierDialogOpen(true);
  };

  const handleEditPromo = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setPromoFormData({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      usageLimit: promo.usageLimit,
      validFrom: promo.validFrom?.split('T')[0],
      validUntil: promo.validUntil?.split('T')[0],
      isActive: promo.isActive,
    });
    setIsPromoDialogOpen(true);
  };

  const handleTierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...tierFormData,
      benefits: typeof tierFormData.benefits === 'string' 
        ? tierFormData.benefits.split(',').map(b => b.trim()) 
        : tierFormData.benefits,
      perks: typeof tierFormData.perks === 'string' 
        ? tierFormData.perks.split(',').map(p => p.trim()) 
        : tierFormData.perks,
    } as InsertVipTier;

    if (selectedTier) {
      updateTierMutation.mutate({ id: selectedTier.id, data: submitData });
    } else {
      createTierMutation.mutate(submitData);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = promoFormData as InsertPromoCode;

    if (selectedPromo) {
      updatePromoMutation.mutate({ id: selectedPromo.id, data: submitData });
    } else {
      createPromoMutation.mutate(submitData);
    }
  };

  const VipTierCard = ({ tier }: { tier: VipTier }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5 text-gold-400" />
              <CardTitle className="text-lg text-white">{tier.name}</CardTitle>
            </div>
            <p className="text-2xl font-bold text-gold-400">${tier.price}</p>
            <p className="text-sm text-gray-400">{tier.duration} days</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditTier(tier)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTierMutation.mutate(tier.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Benefits
            </h4>
            <div className="space-y-1">
              {tier.benefits?.map((benefit, index) => (
                <p key={index} className="text-xs text-gray-300">• {benefit}</p>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Perks
            </h4>
            <div className="space-y-1">
              {tier.perks?.map((perk, index) => (
                <p key={index} className="text-xs text-gray-300">• {perk}</p>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Badge variant="outline" className="text-xs">
              Priority: {tier.priority}
            </Badge>
            <Badge className={tier.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {tier.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PromoCodeCard = ({ promo }: { promo: PromoCode }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-white font-mono">{promo.code}</CardTitle>
            <p className="text-sm text-gray-300">{promo.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditPromo(promo)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deletePromoMutation.mutate(promo.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-green-500/10 rounded">
              <p className="text-xs text-gray-400">Discount</p>
              <p className="text-sm font-bold text-green-400">
                {promo.discountValue}{promo.discountType === 'percentage' ? '%' : '$'} OFF
              </p>
            </div>
            <div className="text-center p-2 bg-blue-500/10 rounded">
              <p className="text-xs text-gray-400">Usage</p>
              <p className="text-sm font-bold text-blue-400">
                {promo.usedCount}/{promo.usageLimit || '∞'}
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            <p>Valid from: {new Date(promo.validFrom).toLocaleDateString()}</p>
            {promo.validUntil && (
              <p>Valid until: {new Date(promo.validUntil).toLocaleDateString()}</p>
            )}
          </div>

          <Badge className={promo.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
            {promo.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (tiersLoading || promosLoading) {
    return <div className="text-white">Loading VIP management...</div>;
  }

  return (
    <div className="space-y-8">
      {/* VIP Tiers Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-gold-400" />
            VIP Tiers Management
          </h2>
          <Dialog open={isTierDialogOpen} onOpenChange={setIsTierDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetTierForm} className="bg-gradient-to-r from-gold-600 to-yellow-600 hover:from-gold-700 hover:to-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Add VIP Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedTier ? "Edit VIP Tier" : "Add New VIP Tier"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTierSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Tier Name</Label>
                    <Input
                      value={tierFormData.name}
                      onChange={(e) => setTierFormData({ ...tierFormData, name: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Gold VIP"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tierFormData.price}
                      onChange={(e) => setTierFormData({ ...tierFormData, price: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Duration (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={tierFormData.duration}
                      onChange={(e) => setTierFormData({ ...tierFormData, duration: parseInt(e.target.value) })}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Priority</Label>
                    <Input
                      type="number"
                      min="0"
                      value={tierFormData.priority}
                      onChange={(e) => setTierFormData({ ...tierFormData, priority: parseInt(e.target.value) })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Benefits (comma-separated)</Label>
                  <Textarea
                    value={Array.isArray(tierFormData.benefits) ? tierFormData.benefits.join(", ") : tierFormData.benefits}
                    onChange={(e) => setTierFormData({ ...tierFormData, benefits: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Server priority access, Custom role, Early access to content"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white">Perks (comma-separated)</Label>
                  <Textarea
                    value={Array.isArray(tierFormData.perks) ? tierFormData.perks.join(", ") : tierFormData.perks}
                    onChange={(e) => setTierFormData({ ...tierFormData, perks: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Discord VIP role, Exclusive car mods, Special events"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tierFormData.isActive}
                    onCheckedChange={(checked) => setTierFormData({ ...tierFormData, isActive: checked })}
                  />
                  <Label className="text-white">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsTierDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gold-600 hover:bg-gold-700">
                    {selectedTier ? "Update" : "Create"} Tier
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipTiers.map((tier: VipTier) => (
            <VipTierCard key={tier.id} tier={tier} />
          ))}
        </div>
        
        {vipTiers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No VIP tiers found. Create your first VIP tier!
          </div>
        )}
      </div>

      {/* Promo Codes Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Promo Codes Management</h2>
          <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetPromoForm} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Promo Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedPromo ? "Edit Promo Code" : "Add New Promo Code"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePromoSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Promo Code</Label>
                    <Input
                      value={promoFormData.code}
                      onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                      className="bg-gray-800 border-gray-600 text-white font-mono"
                      placeholder="SUMMER2024"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Usage Limit</Label>
                    <Input
                      type="number"
                      min="1"
                      value={promoFormData.usageLimit}
                      onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: parseInt(e.target.value) })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Description</Label>
                  <Input
                    value={promoFormData.description}
                    onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Summer sale discount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Discount Type</Label>
                    <select
                      value={promoFormData.discountType}
                      onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Discount Value</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={promoFormData.discountValue}
                      onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder={promoFormData.discountType === 'percentage' ? '10' : '5.00'}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Valid From</Label>
                    <Input
                      type="date"
                      value={promoFormData.validFrom}
                      onChange={(e) => setPromoFormData({ ...promoFormData, validFrom: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Valid Until</Label>
                    <Input
                      type="date"
                      value={promoFormData.validUntil}
                      onChange={(e) => setPromoFormData({ ...promoFormData, validUntil: e.target.value })}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={promoFormData.isActive}
                    onCheckedChange={(checked) => setPromoFormData({ ...promoFormData, isActive: checked })}
                  />
                  <Label className="text-white">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsPromoDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {selectedPromo ? "Update" : "Create"} Promo Code
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((promo: PromoCode) => (
            <PromoCodeCard key={promo.id} promo={promo} />
          ))}
        </div>
        
        {promoCodes.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No promo codes found. Create your first promo code!
          </div>
        )}
      </div>
    </div>
  );
}