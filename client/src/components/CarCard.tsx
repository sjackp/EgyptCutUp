import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Car } from "@shared/schema";
import { Download } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new":
        return "category-new";
      case "exclusive":
        return "category-exclusive";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getCategoryText = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleDownload = () => {
    if (car.downloadUrl) {
      window.open(car.downloadUrl, '_blank');
    }
  };

  // Use a placeholder image if no imageUrl is provided
  const imageUrl = car.imageUrl || `https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`;

  return (
    <Card className="car-card">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={car.name} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
          }}
        />
        {car.category && car.category !== "standard" && (
          <Badge className={`absolute top-2 right-2 ${getCategoryColor(car.category)}`}>
            {getCategoryText(car.category)}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{car.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{car.description || "No description available"}</p>
        <div className="flex items-center justify-between">
          <span className="text-gold-accent font-medium">{car.make}</span>
          <Button 
            className="btn-primary text-sm px-3 py-1"
            onClick={handleDownload}
            disabled={!car.downloadUrl}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
