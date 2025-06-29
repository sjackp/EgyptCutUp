import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { ShopItem } from "@shared/schema";

export default function Shop() {
  const { data: items, isLoading, error } = useQuery<ShopItem[]>({
    queryKey: ["/api/shop"],
  });

  const getIconForType = (type: string, iconClass?: string) => {
    if (iconClass) return iconClass;
    
    switch (type) {
      case "merchandise":
        return "fas fa-tshirt";
      case "subscription":
        return "fas fa-crown";
      case "dlc":
        return "fas fa-car";
      case "pass":
        return "fas fa-certificate";
      default:
        return "fas fa-shopping-bag";
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">EGCU Shop</h1>
            <p className="text-gray-400">Get exclusive EGCU merchandise and premium content</p>
          </div>

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                  <div className="p-6 text-center">
                    <Skeleton className="h-16 w-16 mx-auto mb-4 bg-gray-700" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-full mb-4 bg-gray-700" />
                    <Skeleton className="h-8 w-20 mx-auto mb-4 bg-gray-700" />
                    <Skeleton className="h-10 w-full bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load shop items</h3>
              <p className="text-gray-400">Please try again later</p>
            </div>
          )}

          {items && items.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No items available</h3>
              <p className="text-gray-400">Check back later for new merchandise and content</p>
            </div>
          )}

          {items && items.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-gold-accent transition-colors">
                  <div className="p-6 text-center">
                    <i className={`${getIconForType(item.type, item.iconClass)} text-4xl text-gold-accent mb-4`}></i>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    )}
                    <div className="text-2xl font-bold text-gold-accent mb-4">
                      ${parseFloat(item.price).toFixed(2)}
                      {item.type === "subscription" && <span className="text-sm">/mo</span>}
                    </div>
                    <Button className="w-full bg-racing-red hover:bg-red-700 text-white transition-colors">
                      {item.type === "subscription" ? "Subscribe" : 
                       item.type === "pass" ? "Get Pass" : 
                       item.type === "dlc" ? "Purchase" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items && items.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">
                More items coming soon! Follow our Discord for exclusive deals and early access.
              </p>
              <Button 
                variant="outline" 
                className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-dark-bg"
                onClick={() => window.open("https://discord.gg/egcu", "_blank")}
              >
                Join Discord for Deals
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
