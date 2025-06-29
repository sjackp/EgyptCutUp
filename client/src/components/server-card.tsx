import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Gamepad2 } from "lucide-react";

interface ServerCardProps {
  server: Server;
}

export default function ServerCard({ server }: ServerCardProps) {
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

  const getCapacityPercentage = () => {
    if (server.maxPlayers === 0) return 0;
    return (server.currentPlayers / server.maxPlayers) * 100;
  };

  const isServerAvailable = server.status === "online";

  return (
    <div className="server-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{server.name}</h3>
        <Badge className={`${getStatusColor(server.status)} text-white`}>
          <div className="w-2 h-2 rounded-full bg-white mr-1" />
          {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            <span>Players:</span>
          </div>
          <span className="text-white font-medium">
            {server.currentPlayers}/{server.maxPlayers}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Region:</span>
          </div>
          <span className="text-white">{server.region}</span>
        </div>
        
        {server.track && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-400">
              <Gamepad2 className="h-4 w-4 mr-2" />
              <span>Track:</span>
            </div>
            <span className={`${isServerAvailable ? "text-white" : "text-gray-500"}`}>
              {server.track}
            </span>
          </div>
        )}
        
        <div className="w-full">
          <Progress 
            value={getCapacityPercentage()} 
            className="h-2"
          />
        </div>
      </div>
      
      <Button
        className={`w-full mt-4 font-medium transition-colors ${
          isServerAvailable
            ? "bg-racing-red hover:bg-red-700 text-white"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!isServerAvailable}
        onClick={() => {
          if (server.joinLink && isServerAvailable) {
            window.open(server.joinLink, '_blank');
          }
        }}
      >
        {isServerAvailable ? "Join Server" : "Server Offline"}
      </Button>
    </div>
  );
}
