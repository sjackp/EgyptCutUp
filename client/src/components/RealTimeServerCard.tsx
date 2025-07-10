import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIndividualServerStatus } from "@/hooks/useServerStatus";
import { Users, MapPin, Gamepad2, Crown, Activity, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface RealTimeServerCardProps {
  serverId: number;
  server: {
    id: number;
    name: string;
    region: string;
    maxPlayers: number;
    currentPlayers: number;
    track?: string;
    gameMode?: string;
    status: string;
    joinLink?: string;
    bannerUrl?: string;
  };
}

export default function RealTimeServerCard({ serverId, server }: RealTimeServerCardProps) {
  const { serverStatus, isLoading, lastUpdate, refreshStatus } = useIndividualServerStatus(serverId);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use real-time data if available, fallback to server prop
  const currentServer = serverStatus || server;

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
    if (!currentServer.maxPlayers || currentServer.maxPlayers === 0) return 0;
    return ((currentServer.currentPlayers || 0) / currentServer.maxPlayers) * 100;
  };

  const isServerAvailable = currentServer.status === "online";

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStatus();
    setIsRefreshing(false);
  };

  // Auto-refresh indicator
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceUpdate(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="premium-card group overflow-hidden relative">
      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isServerAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-xs text-white/70 font-medium">
            {timeSinceUpdate < 60 ? `${timeSinceUpdate}s ago` : `${Math.floor(timeSinceUpdate / 60)}m ago`}
          </span>
        </div>
      </div>

      {/* Refresh button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-black/50 hover:bg-black/70 text-white border border-white/20"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Banner Image */}
      <div className="relative mb-6">
        <div className="aspect-video overflow-hidden rounded-t-xl">
          <img
            src={currentServer.bannerUrl || "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop"}
            alt={currentServer.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="absolute top-4 right-16 flex items-center space-x-3">
          {/* Status Labels */}
          <div className="flex flex-col space-y-1 text-right">
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              currentServer.status === 'online' ? 'text-green-400 animate-pulse' : 'text-gray-500'
            }`}>
              {currentServer.status === 'online' ? 'ONLINE' : ''}
            </span>
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              currentServer.status === 'maintenance' ? 'text-yellow-400 animate-pulse' : 'text-gray-500'
            }`}>
              {currentServer.status === 'maintenance' ? 'MAINTENANCE' : ''}
            </span>
            <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${
              currentServer.status === 'offline' ? 'text-red-400 animate-pulse' : 'text-gray-500'
            }`}>
              {currentServer.status === 'offline' ? 'OFFLINE' : ''}
            </span>
          </div>
          
          {/* Traffic Light Status Indicator */}
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex flex-col space-y-1">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentServer.status === 'online' ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentServer.status === 'maintenance' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentServer.status === 'offline' ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' : 'bg-gray-600/50'
              }`}></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-light text-platinum mb-2 tracking-wide">{currentServer.name}</h3>
            <p className="text-amber text-sm uppercase tracking-wider font-medium">{currentServer.region}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center text-silver">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm tracking-wide">Capacity</span>
            </div>
            <span className="text-platinum font-medium text-lg">
              {isLoading ? '...' : `${currentServer.currentPlayers}/${currentServer.maxPlayers}`}
            </span>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-electric-blue h-2 rounded-full transition-all duration-500 ease-out shadow-electric-blue"
              style={{ width: `${getCapacityPercentage()}%` }}
            ></div>
          </div>

          {/* Server Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {currentServer.track && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Gamepad2 className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">Track</span>
                </div>
                <p className="text-platinum font-medium text-sm">{currentServer.track}</p>
              </div>
            )}

            {currentServer.gameMode && (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-amber" />
                  <span className="text-silver text-xs uppercase tracking-wide">Mode</span>
                </div>
                <p className="text-platinum font-medium text-sm">{currentServer.gameMode}</p>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-amber" />
                <span className="text-silver text-xs uppercase tracking-wide">Status</span>
              </div>
              <p className="text-platinum font-medium text-sm capitalize">{currentServer.status}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-4 w-4 text-amber" />
                <span className="text-silver text-xs uppercase tracking-wide">Live</span>
              </div>
              <p className="text-platinum font-medium text-sm">
                {isLoading ? 'Updating...' : 'Real-time'}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          className={`w-full mt-6 rounded-full py-3 font-medium tracking-wide transition-all duration-300 ${
            isServerAvailable
              ? "btn-primary"
              : "bg-white/5 text-silver cursor-not-allowed hover:bg-white/5"
          }`}
          disabled={!isServerAvailable || !currentServer.joinLink}
          onClick={() => {
            if (currentServer.joinLink && isServerAvailable) {
              window.open(currentServer.joinLink, '_blank');
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