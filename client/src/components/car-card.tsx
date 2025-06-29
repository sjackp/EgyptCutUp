import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car } from "@shared/schema";
import { Download } from "lucide-react";

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
            src={car.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
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
          <p className="text-amber font-medium text-sm uppercase tracking-wider">{car.make}</p>
        </div>
        
        {car.description && (
          <p className="text-silver text-sm mb-6 leading-relaxed line-clamp-2">{car.description}</p>
        )}
        
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
