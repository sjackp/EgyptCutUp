import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ShoppingBag, Star, Crown, Car, Award, ExternalLink } from "lucide-react";
import { ShopItem } from "@shared/schema";

export default function Shop() {
  const { data: items, isLoading, error } = useQuery<ShopItem[]>({
    queryKey: ["/api/shop"],
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "merchandise":
        return ShoppingBag;
      case "subscription":
        return Crown;
      case "dlc":
        return Car;
      case "pass":
        return Award;
      default:
        return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-dark-slate to-charcoal text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-racing-red/10 via-transparent to-gold-accent/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(220, 38, 127, 0.1) 0%, transparent 50%)`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <ShoppingBag className="h-8 w-8 text-gold-accent" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gold-accent bg-clip-text text-transparent">
              EGCU Premium Store
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover exclusive merchandise, premium memberships, and elite racing content for the ultimate EGCU experience
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">

          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="group relative bg-gradient-to-br from-charcoal/80 via-dark-slate/60 to-midnight/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-8 text-center">
                    <Skeleton className="h-16 w-16 mx-auto mb-6 bg-gray-600/50 rounded-full" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-3 bg-gray-600/50 rounded-lg" />
                    <Skeleton className="h-4 w-full mb-6 bg-gray-600/50 rounded-lg" />
                    <Skeleton className="h-8 w-24 mx-auto mb-6 bg-gray-600/50 rounded-lg" />
                    <Skeleton className="h-12 w-full bg-gray-600/50 rounded-xl" />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item) => {
                const IconComponent = getIconForType(item.type);
                return (
                  <div key={item.id} className="group relative bg-gradient-to-br from-charcoal/80 via-dark-slate/60 to-midnight/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-gold-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold-accent/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-gold-accent/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-gold-accent/30">
                        <span className="text-xs font-semibold text-gold-accent uppercase tracking-wider">{item.type}</span>
                      </div>
                    </div>
                    
                    <div className="relative p-8 text-center">
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-accent/20 to-racing-red/20 backdrop-blur-sm rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-gold-accent" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-accent transition-colors duration-300">{item.name}</h3>
                      
                      {item.description && (
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                      )}
                      
                      <div className="mb-6">
                        <div className="text-3xl font-bold bg-gradient-to-r from-gold-accent to-yellow-400 bg-clip-text text-transparent">
                          ${parseFloat(item.price).toFixed(2)}
                          {item.type === "subscription" && <span className="text-sm text-gray-400">/mo</span>}
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-racing-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl border border-racing-red/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-racing-red/25">
                        {item.type === "subscription" ? "Subscribe Now" : 
                         item.type === "pass" ? "Get Access Pass" : 
                         item.type === "dlc" ? "Purchase DLC" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {items && items.length > 0 && (
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-charcoal/60 via-dark-slate/40 to-charcoal/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <Star className="h-8 w-8 text-gold-accent mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">More Coming Soon</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Join our Discord community for exclusive deals, early access to new items, and special member discounts.
                  </p>
                </div>
                <Button 
                  className="bg-gradient-to-r from-gold-accent/20 to-gold-accent/10 hover:from-gold-accent hover:to-yellow-400 text-gold-accent hover:text-midnight border border-gold-accent/30 backdrop-blur-sm font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold-accent/25"
                  onClick={() => window.open("https://discord.gg/egcu", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Discord Community
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
