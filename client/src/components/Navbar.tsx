import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { href: "#servers", label: "Servers" },
    { href: "#cars", label: "Cars" },
    { href: "#discord", label: "Discord" },
    { href: "#shop", label: "Shop" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-dark-card border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-racing-red">EGCU</h1>
                <p className="text-xs text-gold-accent">Egypt Cut Up</p>
              </div>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="nav-link"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.isAdmin && (
                  <Link href="/admin">
                    <Button className="btn-admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-gray-300">
                    {user?.firstName || user?.email}
                  </span>
                </div>
                <Button 
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="btn-admin"
              >
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
