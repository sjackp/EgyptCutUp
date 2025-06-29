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
    <div className="car-card">
      <div className="relative">
        <img
          src={car.imageUrl || "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {car.category !== "standard" && (
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(car.category)}`}>
            {car.category?.charAt(0).toUpperCase() + car.category?.slice(1)}
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{car.name}</h3>
        {car.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{car.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-gold-accent font-medium">{car.make}</span>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!car.downloadLink}
            className="bg-racing-red hover:bg-red-700 text-white transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
