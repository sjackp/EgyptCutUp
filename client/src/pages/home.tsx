import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Server, Car, Settings, ShoppingCart } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.firstName || user?.email || 'Admin'}!
          </h1>
          <p className="text-gray-400 text-lg">Manage your EGCU racing community</p>
        </div>

        {/* Admin Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/admin" className="block">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-racing-red transition-colors cursor-pointer">
              <Settings className="h-8 w-8 text-racing-red mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Admin Panel</h3>
              <p className="text-gray-400 text-sm">Manage servers, cars, and content</p>
            </div>
          </Link>

          <Link href="/servers" className="block">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-gold-accent transition-colors cursor-pointer">
              <Server className="h-8 w-8 text-gold-accent mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Servers</h3>
              <p className="text-gray-400 text-sm">Monitor server status and performance</p>
            </div>
          </Link>

          <Link href="/cars" className="block">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-green-500 transition-colors cursor-pointer">
              <Car className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Car Collection</h3>
              <p className="text-gray-400 text-sm">Browse and manage car mods</p>
            </div>
          </Link>

          <Link href="/shop" className="block">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer">
              <ShoppingCart className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Shop</h3>
              <p className="text-gray-400 text-sm">Manage merchandise and products</p>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin">
              <Button className="w-full bg-racing-red hover:bg-red-700 text-white">
                Add New Server
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full bg-gold-accent hover:bg-yellow-500 text-dark-bg">
                Upload Car Mod
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Create Shop Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
