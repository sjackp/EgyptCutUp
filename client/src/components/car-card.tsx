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
        
        {/* Max Speed with Dashboard Gauge */}
        <div className="bg-gradient-to-r from-amber/20 to-electric-blue/20 rounded-lg p-4 mb-6 border border-amber/30">
          <div className="text-center mb-4">
            <p className="text-amber text-xs uppercase tracking-wide mb-1">Top Speed</p>
          </div>
          
          {/* Circular Dashboard Speedometer */}
          {car.maxSpeed && (
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                {/* Gauge Background */}
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    strokeDasharray="188.5"
                    strokeDashoffset="47.1"
                    className="opacity-30"
                  />
                  {/* Speed Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#speedGradient)"
                    strokeWidth="8"
                    strokeDasharray="188.5"
                    strokeDashoffset={188.5 - (Math.min(car.maxSpeed / 400, 1) * 141.4)}
                    strokeLinecap="round"
                    className="transition-all duration-2000 ease-out"
                  />
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Speed Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-platinum">{car.maxSpeed}</span>
                  <span className="text-xs text-silver">km/h</span>
                </div>
                
                {/* Needle */}
                <div 
                  className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-racing-red origin-bottom transform -translate-x-1/2 -translate-y-8 transition-transform duration-2000 ease-out"
                  style={{
                    transform: `translate(-50%, -2rem) rotate(${-135 + (Math.min(car.maxSpeed / 400, 1) * 270)}deg)`
                  }}
                ></div>
              </div>
              
              {/* Speed Scale */}
              <div className="flex justify-between w-full text-xs text-silver mt-2 px-2">
                <span>0</span>
                <span className="text-amber">200</span>
                <span className="text-racing-red">400+</span>
              </div>
            </div>
          )}
          
          {!car.maxSpeed && (
            <div className="text-center">
              <p className="text-platinum text-lg font-medium">N/A</p>
            </div>
          )}
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
