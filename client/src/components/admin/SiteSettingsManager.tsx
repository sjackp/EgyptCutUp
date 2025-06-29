import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Settings, Image, Layout, Palette } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  description: string;
  category: string;
}

interface InsertSiteSetting {
  key: string;
  value: string;
  description: string;
  category: string;
}

export function SiteSettingsManager() {
  const [selectedSetting, setSelectedSetting] = useState<SiteSetting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertSiteSetting>>({
    key: "",
    value: "",
    description: "",
    category: "general",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/site-settings"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSiteSetting) => {
      return await apiRequest("/api/site-settings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Setting created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create setting", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: Partial<InsertSiteSetting> }) => {
      return await apiRequest(`/api/site-settings/${key}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Setting updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update setting", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      return await apiRequest(`/api/site-settings/${key}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Setting deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete setting", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      description: "",
      category: "general",
    });
    setSelectedSetting(null);
  };

  const handleEdit = (setting: SiteSetting) => {
    setSelectedSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      category: setting.category,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = formData as InsertSiteSetting;

    if (selectedSetting) {
      updateMutation.mutate({ key: selectedSetting.key, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const categorizeSettings = (settings: SiteSetting[]) => {
    return {
      general: settings.filter(s => s.category === 'general'),
      images: settings.filter(s => s.category === 'images'),
      banners: settings.filter(s => s.category === 'banners'),
      headers: settings.filter(s => s.category === 'headers'),
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'images': return <Image className="h-4 w-4" />;
      case 'banners': return <Layout className="h-4 w-4" />;
      case 'headers': return <Palette className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const SettingCard = ({ setting }: { setting: SiteSetting }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-sm text-white font-mono">{setting.key}</CardTitle>
            <p className="text-xs text-gray-400 mt-1">{setting.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(setting)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(setting.key)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {setting.value.startsWith('http') ? (
            <div>
              <p className="text-xs text-gray-400 mb-1">Preview:</p>
              <img 
                src={setting.value} 
                alt={setting.key}
                className="w-full h-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="text-xs text-blue-400 break-all mt-2">{setting.value}</p>
            </div>
          ) : (
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-xs text-gray-300 break-words">{setting.value}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-white">Loading site settings...</div>;
  }

  const categorizedSettings = categorizeSettings(settings);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-400" />
          Site Settings Management
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedSetting ? "Edit Site Setting" : "Add New Site Setting"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Setting Key</Label>
                  <Input
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white font-mono"
                    placeholder="header_logo_url"
                    required
                    disabled={!!selectedSetting}
                  />
                </div>
                <div>
                  <Label className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="images">Images</SelectItem>
                      <SelectItem value="banners">Banners</SelectItem>
                      <SelectItem value="headers">Headers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="URL for the header logo image"
                />
              </div>

              <div>
                <Label className="text-white">Value</Label>
                <Textarea
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="https://example.com/logo.png"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {selectedSetting ? "Update" : "Create"} Setting
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            General ({categorizedSettings.general.length})
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-green-600">
            <Image className="h-4 w-4 mr-2" />
            Images ({categorizedSettings.images.length})
          </TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-purple-600">
            <Layout className="h-4 w-4 mr-2" />
            Banners ({categorizedSettings.banners.length})
          </TabsTrigger>
          <TabsTrigger value="headers" className="data-[state=active]:bg-yellow-600">
            <Palette className="h-4 w-4 mr-2" />
            Headers ({categorizedSettings.headers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedSettings.general.map((setting: SiteSetting) => (
              <SettingCard key={setting.id} setting={setting} />
            ))}
          </div>
          {categorizedSettings.general.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No general settings found. Add your first setting!
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedSettings.images.map((setting: SiteSetting) => (
              <SettingCard key={setting.id} setting={setting} />
            ))}
          </div>
          {categorizedSettings.images.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No image settings found. Add image URLs for your site!
            </div>
          )}
        </TabsContent>

        <TabsContent value="banners" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedSettings.banners.map((setting: SiteSetting) => (
              <SettingCard key={setting.id} setting={setting} />
            ))}
          </div>
          {categorizedSettings.banners.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No banner settings found. Add banner configurations!
            </div>
          )}
        </TabsContent>

        <TabsContent value="headers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorizedSettings.headers.map((setting: SiteSetting) => (
              <SettingCard key={setting.id} setting={setting} />
            ))}
          </div>
          {categorizedSettings.headers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No header settings found. Configure your site headers!
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <h3 className="text-yellow-400 font-semibold mb-2">Common Site Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>
            <strong>Images:</strong>
            <ul className="ml-4 text-xs">
              <li>• header_logo_url</li>
              <li>• footer_background_url</li>
              <li>• hero_banner_url</li>
            </ul>
          </div>
          <div>
            <strong>General:</strong>
            <ul className="ml-4 text-xs">
              <li>• site_title</li>
              <li>• contact_email</li>
              <li>• discord_invite_url</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}