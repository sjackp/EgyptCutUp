import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { Link } from "wouter";
import { Play, Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen text-platinum">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-midnight/50 to-midnight z-10"></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4) contrast(1.2)"
          }}
        />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
              <span className="luxury-text">Egypt</span>
              <br />
              <span className="text-electric-blue font-bold">Cut Up</span>
            </h1>
            <div className="w-24 h-1 bg-electric-blue mx-auto mb-8"></div>
            <p className="text-2xl md:text-3xl text-amber font-light mb-4 tracking-wide">
              MENA's Premier Racing Experience
            </p>
            <p className="text-silver text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 11,000+ passionate racers in Egypt's most exclusive Assetto Corsa community. 
              Experience premium servers, custom modifications, and competitive racing since March 2022.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/servers">
              <Button className="btn-primary px-12 py-4 text-lg rounded-full font-medium tracking-wide">
                <Play className="h-5 w-5 mr-3" />
                Enter Racing
              </Button>
            </Link>
            <Link href="/discord">
              <Button className="btn-secondary px-12 py-4 text-lg rounded-full font-medium tracking-wide">
                <SiDiscord className="h-5 w-5 mr-3" />
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light tracking-tight luxury-text mb-4">Performance Metrics</h2>
            <div className="w-16 h-0.5 bg-electric-blue mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="premium-card text-center">
              <div className="text-5xl font-light text-electric-blue mb-4">11K+</div>
              <div className="text-silver font-medium tracking-wide">Community Members</div>
              <div className="w-8 h-0.5 bg-electric-blue mx-auto mt-3 opacity-60"></div>
            </div>
            <div className="premium-card text-center">
              <div className="text-5xl font-light text-amber mb-4">500+</div>
              <div className="text-silver font-medium tracking-wide">Daily Active</div>
              <div className="w-8 h-0.5 bg-amber mx-auto mt-3 opacity-60"></div>
            </div>
            <div className="premium-card text-center">
              <div className="text-5xl font-light text-emerald-400 mb-4">50+</div>
              <div className="text-silver font-medium tracking-wide">Custom Vehicles</div>
              <div className="w-8 h-0.5 bg-emerald-400 mx-auto mt-3 opacity-60"></div>
            </div>
            <div className="premium-card text-center">
              <div className="text-5xl font-light text-violet-400 mb-4">24/7</div>
              <div className="text-silver font-medium tracking-wide">Server Uptime</div>
              <div className="w-8 h-0.5 bg-violet-400 mx-auto mt-3 opacity-60"></div>
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
