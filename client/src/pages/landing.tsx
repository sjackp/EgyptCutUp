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

      {/* Premium Features */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-charcoal to-midnight opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light tracking-tight luxury-text mb-6">Excellence in Racing</h2>
            <div className="w-16 h-0.5 bg-electric-blue mx-auto mb-6"></div>
            <p className="text-silver text-xl max-w-3xl mx-auto leading-relaxed">
              Experience the pinnacle of virtual motorsport with cutting-edge technology and unmatched community engagement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center premium-card">
              <div className="w-20 h-20 bg-electric-blue rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-electric-blue">
                <Users className="h-10 w-10 text-midnight" />
              </div>
              <h3 className="text-2xl font-light text-platinum mb-4 tracking-wide">Elite Community</h3>
              <p className="text-silver leading-relaxed">
                Connect with MENA's most passionate racing enthusiasts in an exclusive environment designed for serious competitors
              </p>
            </div>
            
            <div className="text-center premium-card">
              <div className="w-20 h-20 bg-amber rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-amber">
                <Play className="h-10 w-10 text-midnight" />
              </div>
              <h3 className="text-2xl font-light text-platinum mb-4 tracking-wide">Enterprise Infrastructure</h3>
              <p className="text-silver leading-relaxed">
                High-performance dedicated servers with enterprise-grade hardware delivering ultra-low latency across multiple regions
              </p>
            </div>
            
            <div className="text-center premium-card">
              <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-green-500">
                <SiDiscord className="h-10 w-10 text-midnight" />
              </div>
              <h3 className="text-2xl font-light text-platinum mb-4 tracking-wide">24/7 Engagement</h3>
              <p className="text-silver leading-relaxed">
                Round-the-clock community interaction with exclusive events, championships, and premium content access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative py-20 px-4 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-midnight to-charcoal opacity-80"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center">
                  <span className="text-midnight font-bold">E</span>
                </div>
                <h3 className="text-2xl font-light luxury-text">EGCU</h3>
              </div>
              <p className="text-silver text-sm leading-relaxed mb-6">
                Egypt Cut Up - MENA's premier racing community delivering unparalleled virtual motorsport experiences since March 2022
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-silver hover:bg-electric-blue hover:text-midnight transition-all duration-300">
                  <SiDiscord className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-platinum font-medium mb-6 tracking-wide">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="/servers" className="text-silver hover:text-electric-blue transition-colors text-sm">Server Status</Link></li>
                <li><Link href="/cars" className="text-silver hover:text-electric-blue transition-colors text-sm">Vehicle Collection</Link></li>
                <li><Link href="/discord" className="text-silver hover:text-electric-blue transition-colors text-sm">Community Hub</Link></li>
                <li><Link href="/shop" className="text-silver hover:text-electric-blue transition-colors text-sm">Premium Store</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-platinum font-medium mb-6 tracking-wide">Support</h4>
              <ul className="space-y-3 text-silver text-sm">
                <li><a href="#" className="hover:text-electric-blue transition-colors">Racing Guidelines</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">FAQ & Guides</a></li>
                <li><a href="#" className="hover:text-electric-blue transition-colors">Contact Team</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-platinum font-medium mb-6 tracking-wide">Performance</h4>
              <ul className="space-y-3 text-silver text-sm">
                <li>11,000+ Community Members</li>
                <li>500+ Daily Active Users</li>
                <li>50+ Custom Vehicles</li>
                <li>24/7 Server Availability</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-silver text-sm">
                © 2024 Egypt Cut Up Racing Community. All rights reserved.
              </p>
              <p className="text-silver text-sm mt-4 md:mt-0">
                Powered by passion for automotive excellence
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
