import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Server, Car, Settings, ShoppingCart } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-platinum">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-light tracking-tight luxury-text mb-6">
            Welcome back, {user?.username || 'Administrator'}
          </h1>
          <div className="w-16 h-0.5 bg-electric-blue mx-auto mb-6"></div>
          <p className="text-silver text-xl">Premium management dashboard for EGCU racing community</p>
        </div>

        {/* Management Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Link href="/admin" className="block group">
            <div className="premium-card text-center">
              <div className="w-16 h-16 bg-electric-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-electric-blue group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-light text-platinum mb-3 tracking-wide">Control Center</h3>
              <p className="text-silver text-sm leading-relaxed">Comprehensive management of servers, vehicles, and community content</p>
            </div>
          </Link>

          <Link href="/servers" className="block group">
            <div className="premium-card text-center">
              <div className="w-16 h-16 bg-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-amber group-hover:scale-110 transition-transform duration-300">
                <Server className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-light text-platinum mb-3 tracking-wide">Infrastructure</h3>
              <p className="text-silver text-sm leading-relaxed">Real-time monitoring and performance analytics for racing servers</p>
            </div>
          </Link>

          <Link href="/cars" className="block group">
            <div className="premium-card text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-green-500 group-hover:scale-110 transition-transform duration-300">
                <Car className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-light text-platinum mb-3 tracking-wide">Vehicle Collection</h3>
              <p className="text-silver text-sm leading-relaxed">Curated selection of premium automotive modifications and assets</p>
            </div>
          </Link>

          <Link href="/shop" className="block group">
            <div className="premium-card text-center">
              <div className="w-16 h-16 bg-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-violet-500 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-light text-platinum mb-3 tracking-wide">Premium Store</h3>
              <p className="text-silver text-sm leading-relaxed">Exclusive merchandise and digital content for community members</p>
            </div>
          </Link>
        </div>

        {/* Executive Actions */}
        <div className="premium-card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light tracking-tight luxury-text mb-4">Executive Actions</h2>
            <div className="w-12 h-0.5 bg-electric-blue mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin">
              <Button className="w-full btn-primary py-4 text-lg rounded-full font-medium tracking-wide">
                Deploy New Server
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full btn-secondary py-4 text-lg rounded-full font-medium tracking-wide">
                Publish Vehicle Mod
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-midnight py-4 text-lg rounded-full font-medium tracking-wide transition-all duration-300 hover:scale-105">
                Launch Store Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
