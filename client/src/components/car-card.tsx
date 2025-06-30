import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car } from "@shared/schema";
import { Download, Gauge, Zap, Weight, Timer } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new":
        return "bg-electric-blue text-midnight";
      case "exclusive":
        return "bg-amber text-midnight";
      default:
        return "bg-white/20 text-platinum";
    }
  };

  const handleDownload = () => {
    if (car.downloadLink) {
      window.open(car.downloadLink, '_blank');
    }
  };

  return (
    <div className="premium-card group overflow-hidden">
      <div className="relative">
        <div className="aspect-video overflow-hidden rounded-t-xl">
          <img
            src={car.thumbnail || "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
        {car.category && car.category !== "standard" && (
          <Badge className={`absolute top-4 right-4 ${getCategoryColor(car.category)} px-3 py-1 rounded-full font-medium tracking-wide shadow-lg`}>
            {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-light text-platinum mb-2 tracking-wide">{car.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <p className="text-amber font-medium text-sm uppercase tracking-wider">{car.make}</p>
            <p className="text-silver text-sm font-medium">{car.year}</p>
          </div>
        </div>
        
        {/* Performance Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber" />
              <span className="text-silver text-xs uppercase tracking-wide">Power</span>
            </div>
            <p className="text-platinum font-medium">{car.horsepower || 'N/A'} HP</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-amber" />
              <span className="text-silver text-xs uppercase tracking-wide">Torque</span>
            </div>
            <p className="text-platinum font-medium">{car.torque || 'N/A'} Nm</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Weight className="h-4 w-4 text-amber" />
              <span className="text-silver text-xs uppercase tracking-wide">Weight</span>
            </div>
            <p className="text-platinum font-medium">{car.weight || 'N/A'} kg</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="h-4 w-4 text-amber" />
              <span className="text-silver text-xs uppercase tracking-wide">0-100</span>
            </div>
            <p className="text-platinum font-medium">{car.acceleration || 'N/A'}s</p>
          </div>
        </div>
        
        {/* Max Speed */}
        <div className="bg-gradient-to-r from-amber/20 to-electric-blue/20 rounded-lg p-3 mb-6 border border-amber/30">
          <div className="flex items-center justify-center space-x-3">
            {/* Circular Gauge Icon */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                />
                {/* Progress arc */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(251, 191, 36)"
                  strokeWidth="2"
                  strokeDasharray="75, 25"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
              {/* Center needle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-4 bg-amber rounded-full transform rotate-45 origin-bottom"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-amber text-xs uppercase tracking-wide mb-1">Top Speed</p>
              <p className="text-platinum text-lg font-medium">{car.maxSpeed || 'N/A'} km/h</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleDownload}
          disabled={!car.downloadLink}
          className={`w-full rounded-full py-3 font-medium tracking-wide transition-all duration-300 ${
            car.downloadLink 
              ? "btn-primary" 
              : "bg-white/5 text-silver cursor-not-allowed hover:bg-white/5"
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          {car.downloadLink ? "Download Modification" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
