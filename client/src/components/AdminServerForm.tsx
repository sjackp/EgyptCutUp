import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertServerSchema, type Server, type InsertServer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function AdminServerForm() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  const form = useForm<InsertServer>({
    resolver: zodResolver(insertServerSchema),
    defaultValues: {
      name: "",
      region: "",
      maxPlayers: 32,
      currentPlayers: 0,
      track: "",
      status: "offline",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertServer) => {
      await apiRequest("POST", "/api/servers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      form.reset();
      toast({
        title: "Success",
        description: "Server created successfully",
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
        description: "Failed to create server",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertServer> }) => {
      await apiRequest("PUT", `/api/servers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      setEditingId(null);
      form.reset();
      toast({
        title: "Success",
        description: "Server updated successfully",
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
        description: "Failed to update server",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/servers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
      toast({
        title: "Success",
        description: "Server deleted successfully",
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
        description: "Failed to delete server",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertServer) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (server: Server) => {
    setEditingId(server.id);
    form.reset({
      name: server.name,
      region: server.region,
      maxPlayers: server.maxPlayers,
      currentPlayers: server.currentPlayers,
      track: server.track || "",
      status: server.status || "offline",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this server?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? "Edit Server" : "Add New Server"}
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
                      <FormLabel className="text-gray-300">Server Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="e.g., EGCU Main Server"
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
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="e.g., 🇪🇬 Egypt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
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
                          className="bg-dark-bg border-dark-border text-white"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Current Players</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          className="bg-dark-bg border-dark-border text-white"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                          <SelectTrigger className="bg-dark-bg border-dark-border text-white">
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
                        className="bg-dark-bg border-dark-border text-white"
                        placeholder="e.g., Cairo Ring Road"
                      />
                    </FormControl>
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
                      Update Server
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Server
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

      {/* Servers List */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-white">Existing Servers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b border-dark-border pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : servers?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No servers configured yet.</p>
          ) : (
            <div className="space-y-4">
              {servers?.map((server) => (
                <div key={server.id} className="border-b border-dark-border pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{server.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {server.region} • {server.currentPlayers}/{server.maxPlayers} players
                      </p>
                      <p className="text-gray-400 text-sm">
                        Track: {server.track || "N/A"} • Status: {server.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(server)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(server.id)}
                        size="sm"
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
