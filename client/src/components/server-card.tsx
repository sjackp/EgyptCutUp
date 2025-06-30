import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Gamepad2, Crown, Activity, ExternalLink } from "lucide-react";

interface ServerCardProps {
  server: Server;
}

export default function ServerCard({ server }: ServerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 shadow-green-500/50";
      case "offline":
        return "bg-red-500 shadow-red-500/50";
      case "maintenance":
        return "bg-yellow-500 shadow-yellow-500/50";
      default:
        return "bg-gray-500 shadow-gray-500/50";
    }
  };

  const getCapacityPercentage = () => {
    if (!server.maxPlayers || server.maxPlayers === 0) return 0;
    return ((server.currentPlayers || 0) / server.maxPlayers) * 100;
  };

  const isServerAvailable = server.status === "online";

  return (
    <div className="premium-card group overflow-hidden">
      {/* Banner Image */}
      <div className="relative mb-6">
        <div className="aspect-video overflow-hidden rounded-t-xl">
          <img
            src={server.bannerUrl || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop"}
            alt={server.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          {/* Status Labels */}
          <div className="flex flex-col space-y-1 text-right">
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              server.status === 'online' ? 'text-green-400 animate-pulse' : 'text-gray-500'
            }`}>
              {server.status === 'online' ? 'ONLINE' : ''}
            </span>
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              server.status === 'maintenance' ? 'text-yellow-400 animate-pulse' : 'text-gray-500'
            }`}>
              {server.status === 'maintenance' ? 'MAINTENANCE' : ''}
            </span>
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              server.status === 'offline' ? 'text-red-400 animate-pulse' : 'text-gray-500'
            }`}>
              {server.status === 'offline' ? 'OFFLINE' : ''}
            </span>
          </div>
          
          {/* Traffic Light Status Indicator */}
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex flex-col space-y-1">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                server.status === 'online' ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                server.status === 'maintenance' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                server.status === 'offline' ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-light text-platinum mb-2 tracking-wide">{server.name}</h3>
            <p className="text-amber text-sm uppercase tracking-wider font-medium">{server.region}</p>
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

          {/* Server Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {server.track && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Gamepad2 className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">Track</span>
                </div>
                <p className="text-platinum font-medium text-sm">{server.track}</p>
              </div>
            )}

            {server.trafficDensity !== null && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">Traffic</span>
                </div>
                <p className="text-platinum font-medium text-sm">{server.trafficDensity}%</p>
              </div>
            )}

            {server.availableVipSlots !== null && server.availableVipSlots > 0 && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">VIP Slots</span>
                </div>
                <p className="text-platinum font-medium text-sm">{server.availableVipSlots} Available</p>
              </div>
            )}

            {server.gameMode && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">Mode</span>
                </div>
                <p className="text-platinum font-medium text-sm">{server.gameMode}</p>
              </div>
            )}
          </div>
        </div>
        
        <Button
          className={`w-full mt-6 rounded-full py-3 font-medium tracking-wide transition-all duration-300 ${
            isServerAvailable
              ? "btn-primary"
              : "bg-white/5 text-silver cursor-not-allowed hover:bg-white/5"
          }`}
          disabled={!isServerAvailable || !server.joinLink}
          onClick={() => {
            if (server.joinLink && isServerAvailable) {
              window.open(server.joinLink, '_blank');
            }
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {isServerAvailable ? "Join Server" : "Server Offline"}
        </Button>
      </div>
    </div>
  );
}
