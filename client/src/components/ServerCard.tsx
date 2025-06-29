import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Server } from "@shared/schema";
import { Circle } from "lucide-react";

interface ServerCardProps {
  server: Server;
}

export function ServerCard({ server }: ServerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const capacityPercentage = server.maxPlayers > 0 ? (server.currentPlayers / server.maxPlayers) * 100 : 0;

  return (
    <Card className="server-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{server.name}</h3>
        <Badge className={`${getStatusColor(server.status)} text-white`}>
          <Circle className="w-2 h-2 mr-1 fill-current" />
          {getStatusText(server.status)}
        </Badge>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Players:</span>
          <span className="text-white font-medium">
            {server.currentPlayers}/{server.maxPlayers}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Region:</span>
          <span className="text-white">{server.region}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Track:</span>
          <span className={server.status === "offline" ? "text-gray-500" : "text-white"}>
            {server.track || "N/A"}
          </span>
        </div>
        <Progress 
          value={capacityPercentage} 
          className="w-full h-2"
        />
      </div>
      <Button 
        className={`w-full mt-4 ${
          server.status === "online" 
            ? "btn-primary" 
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
        disabled={server.status !== "online"}
      >
        {server.status === "online" ? "Join Server" : "Server Offline"}
      </Button>
    </Card>
  );
}
