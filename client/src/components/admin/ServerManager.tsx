import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Plus, Server, Users, Crown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Server as ServerType, InsertServer } from "@shared/schema";

export function ServerManager() {
  const [selectedServer, setSelectedServer] = useState<ServerType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertServer>>({
    name: "",
    region: "",
    serverNumber: 1,
    trafficDensity: "medium",
    map: "",
    maxPlayers: 32,
    currentPlayers: 0,
    vipSlots: 0,
    availableVipSlots: 0,
    status: "offline",
    track: "",
    gameMode: "Free Roam",
    joinLink: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: servers = [], isLoading } = useQuery({
    queryKey: ["/api/servers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertServer) => {
      return await apiRequest("/api/servers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Server created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create server", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertServer> }) => {
      return await apiRequest(`/api/servers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Server updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update server", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/servers/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({ title: "Server deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete server", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      region: "",
      serverNumber: 1,
      trafficDensity: "medium",
      map: "",
      maxPlayers: 32,
      currentPlayers: 0,
      vipSlots: 0,
      availableVipSlots: 0,
      status: "offline",
      track: "",
      gameMode: "Free Roam",
      joinLink: "",
    });
    setSelectedServer(null);
  };

  const handleEdit = (server: ServerType) => {
    setSelectedServer(server);
    setFormData({
      name: server.name,
      region: server.region,
      serverNumber: server.serverNumber || 1,
      trafficDensity: server.trafficDensity || "medium",
      map: server.map || "",
      maxPlayers: server.maxPlayers,
      currentPlayers: server.currentPlayers || 0,
      vipSlots: server.vipSlots || 0,
      availableVipSlots: server.availableVipSlots || 0,
      status: server.status,
      track: server.track || "",
      gameMode: server.gameMode || "Free Roam",
      joinLink: server.joinLink || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = formData as InsertServer;

    if (selectedServer) {
      updateMutation.mutate({ id: selectedServer.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "offline": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "maintenance": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getTrafficColor = (density: string) => {
    switch (density) {
      case "low": return "bg-blue-500/20 text-blue-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "high": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const ServerCard = ({ server }: { server: ServerType }) => (
    <Card className="glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg text-white">{server.name}</CardTitle>
              <Badge className={getStatusColor(server.status)}>
                {server.status}
              </Badge>
            </div>
            <p className="text-gold-400 font-semibold">#{server.serverNumber} • {server.region}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(server)}
              className="text-white hover:bg-white/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMutation.mutate(server.id)}
              className="text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-blue-500/10 rounded">
            <p className="text-xs text-gray-400">Players</p>
            <p className="text-sm font-bold text-blue-400">
              {server.currentPlayers || 0}/{server.maxPlayers}
            </p>
          </div>
          <div className="text-center p-2 bg-purple-500/10 rounded">
            <p className="text-xs text-gray-400">VIP Slots</p>
            <p className="text-sm font-bold text-purple-400">
              {server.availableVipSlots || 0}/{server.vipSlots || 0}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Map:</span>
            <span className="text-white text-sm">{server.map || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Traffic:</span>
            <Badge className={getTrafficColor(server.trafficDensity || "medium")}>
              {server.trafficDensity || "medium"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Mode:</span>
            <span className="text-white text-sm">{server.gameMode}</span>
          </div>
        </div>
        
        {server.joinLink && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gold-500/50 text-gold-400 hover:bg-gold-500/10"
            onClick={() => window.open(server.joinLink, '_blank')}
          >
            Join Server
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="text-white">Loading servers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Server Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedServer ? "Edit Server" : "Add New Server"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Server Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="EGCU Drift Paradise"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Server Number</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.serverNumber}
                    onChange={(e) => setFormData({ ...formData, serverNumber: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Region</Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Egypt">Egypt</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="Jordan">Jordan</SelectItem>
                      <SelectItem value="Lebanon">Lebanon</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Map</Label>
                  <Input
                    value={formData.map}
                    onChange={(e) => setFormData({ ...formData, map: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Tokyo Highway"
                  />
                </div>
                <div>
                  <Label className="text-white">Traffic Density</Label>
                  <Select value={formData.trafficDensity} onValueChange={(value) => setFormData({ ...formData, trafficDensity: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Max Players</Label>
                  <Input
                    type="number"
                    min="1"
                    max="200"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white">Current Players</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.currentPlayers}
                    onChange={(e) => setFormData({ ...formData, currentPlayers: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">VIP Slots</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.vipSlots}
                    onChange={(e) => {
                      const vipSlots = parseInt(e.target.value);
                      setFormData({ 
                        ...formData, 
                        vipSlots,
                        availableVipSlots: Math.min(formData.availableVipSlots || 0, vipSlots)
                      });
                    }}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Available VIP Slots</Label>
                  <Input
                    type="number"
                    min="0"
                    max={formData.vipSlots || 0}
                    value={formData.availableVipSlots}
                    onChange={(e) => setFormData({ ...formData, availableVipSlots: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Game Mode</Label>
                  <Select value={formData.gameMode} onValueChange={(value) => setFormData({ ...formData, gameMode: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="Free Roam">Free Roam</SelectItem>
                      <SelectItem value="Drift">Drift</SelectItem>
                      <SelectItem value="Racing">Racing</SelectItem>
                      <SelectItem value="Cruise">Cruise</SelectItem>
                      <SelectItem value="Touge">Touge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Track</Label>
                <Input
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Nurburgring"
                />
              </div>

              <div>
                <Label className="text-white">Join Link</Label>
                <Input
                  value={formData.joinLink}
                  onChange={(e) => setFormData({ ...formData, joinLink: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="steam://connect/..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {selectedServer ? "Update" : "Create"} Server
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server: ServerType) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
      
      {servers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No servers found. Add your first server!
        </div>
      )}
    </div>
  );
}