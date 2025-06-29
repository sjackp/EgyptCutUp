import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { Link } from "wouter";
import { Play, Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-dark-bg z-10"></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Egypt <span className="text-racing-red">Cut Up</span>
          </h1>
          <p className="text-xl md:text-2xl text-gold-accent mb-2">🏁 MENA's Premier Racing Community</p>
          <p className="text-gray-300 text-lg mb-8">11,000+ Members | 500+ Active Online | Since March 2022</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/servers">
              <Button className="bg-racing-red hover:bg-red-700 text-white px-8 py-3">
                <Play className="h-5 w-5 mr-2" />
                Join Server
              </Button>
            </Link>
            <Link href="/discord">
              <Button variant="outline" className="border-2 border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-dark-bg px-8 py-3">
                <SiDiscord className="h-5 w-5 mr-2" />
                Discord
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <div className="text-3xl font-bold text-racing-red mb-2">11,000+</div>
              <div className="text-gray-400">Discord Members</div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <div className="text-3xl font-bold text-gold-accent mb-2">500+</div>
              <div className="text-gray-400">Active Daily</div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-400">Car Mods</div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
              <div className="text-gray-400">Regional Servers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose EGCU?</h2>
            <p className="text-gray-400 text-lg">The ultimate Assetto Corsa experience in the MENA region</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-racing-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Massive Community</h3>
              <p className="text-gray-400">Join thousands of racing enthusiasts from across Egypt and the Middle East</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-dark-bg" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Servers</h3>
              <p className="text-gray-400">High-performance dedicated servers across multiple regions for optimal gameplay</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <SiDiscord className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Active Discord</h3>
              <p className="text-gray-400">24/7 community chat, events, tournaments, and exclusive content sharing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-racing-red mb-4">EGCU</h3>
              <p className="text-gray-400 text-sm mb-4">Egypt Cut Up - MENA's premier racing community since March 2022</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <SiDiscord className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/servers" className="hover:text-white transition-colors">Servers</Link></li>
                <li><Link href="/cars" className="hover:text-white transition-colors">Car Collection</Link></li>
                <li><Link href="/discord" className="hover:text-white transition-colors">Discord</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Rules & Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Statistics</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>11,000+ Discord Members</li>
                <li>500+ Active Daily</li>
                <li>50+ Car Mods</li>
                <li>3 Regional Servers</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-border mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Egypt Cut Up (EGCU). All rights reserved. | Powered by the MENA racing community</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
