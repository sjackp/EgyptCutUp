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
        return "server-status-online";
      case "offline":
        return "server-status-offline";
      case "maintenance":
        return "server-status-maintenance";
      default:
        return "bg-gray-500";
    }
  };

  const getCapacityPercentage = () => {
    if (!server.maxPlayers || server.maxPlayers === 0) return 0;
    return ((server.currentPlayers || 0) / server.maxPlayers) * 100;
  };

  const isServerAvailable = server.status === "online";

  return (
    <div className="premium-card group">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-light text-platinum mb-2 tracking-wide">{server.name}</h3>
          <p className="text-silver text-sm uppercase tracking-wider">{server.region}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getStatusColor(server.status)} animate-pulse`}></div>
          <span className="text-sm font-medium text-platinum capitalize tracking-wide">{server.status}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center text-silver">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm tracking-wide">Capacity</span>
          </div>
          <span className="text-platinum font-medium text-lg">{server.currentPlayers}/{server.maxPlayers}</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-electric-blue h-2 rounded-full transition-all duration-500 ease-out shadow-electric-blue"
            style={{ width: `${getCapacityPercentage()}%` }}
          ></div>
        </div>
        
        {server.track && (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center text-silver">
              <Gamepad2 className="h-4 w-4 mr-2" />
              <span className="text-sm tracking-wide">Circuit</span>
            </div>
            <span className="text-amber font-medium">{server.track}</span>
          </div>
        )}
        
        {server.gameMode && (
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center text-silver">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm tracking-wide">Game Mode</span>
            </div>
            <span className="text-platinum">{server.gameMode}</span>
          </div>
        )}
      </div>
      
      <Button
        className={`w-full mt-6 rounded-full py-3 font-medium tracking-wide transition-all duration-300 ${
          isServerAvailable
            ? "btn-primary"
            : "bg-white/5 text-silver cursor-not-allowed hover:bg-white/5"
        }`}
        disabled={!isServerAvailable}
        onClick={() => {
          if (server.joinLink && isServerAvailable) {
            window.open(server.joinLink, '_blank');
          }
        }}
      >
        {isServerAvailable ? "Enter Server" : "Server Offline"}
      </Button>
    </div>
  );
}
