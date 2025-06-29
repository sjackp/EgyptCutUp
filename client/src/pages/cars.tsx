import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import CarCard from "@/components/car-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Car } from "@shared/schema";

export default function Cars() {
  const [selectedMake, setSelectedMake] = useState<string>("all");
  
  const { data: cars, isLoading, error } = useQuery<Car[]>({
    queryKey: selectedMake === "all" ? ["/api/cars"] : ["/api/cars", { make: selectedMake }],
    queryFn: async () => {
      const url = selectedMake === "all" ? "/api/cars" : `/api/cars?make=${selectedMake}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch cars");
      return response.json();
    },
  });

  const makes = ["all", "BMW", "Mercedes", "Audi", "Ferrari", "Lotus", "Porsche", "Lamborghini", "McLaren"];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Car Collection</h1>
            <p className="text-gray-400">Explore our extensive collection of modded cars</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {makes.map((make) => (
              <Button
                key={make}
                onClick={() => setSelectedMake(make)}
                className={`filter-btn ${
                  selectedMake === make
                    ? "bg-racing-red text-white"
                    : "bg-dark-card border border-dark-border text-gray-300 hover:text-white"
                }`}
              >
                {make === "all" ? "All Cars" : make}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-48 bg-gray-700" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-full mb-3 bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                      <Skeleton className="h-8 w-20 bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load cars</h3>
              <p className="text-gray-400">Please try again later</p>
            </div>
          )}

          {cars && cars.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No cars found</h3>
              <p className="text-gray-400">
                {selectedMake === "all" 
                  ? "Check back later for new car releases" 
                  : `No ${selectedMake} cars available`}
              </p>
            </div>
          )}

          {cars && cars.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-gray-400 mb-4">
                  Showing {cars.length} car{cars.length !== 1 ? 's' : ''}
                  {selectedMake !== "all" && ` from ${selectedMake}`}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
