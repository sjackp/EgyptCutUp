import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/servers", label: "Servers" },
    { href: "/cars", label: "Cars" },
    { href: "/discord", label: "Discord" },
    { href: "/shop", label: "Shop" },
  ];

  const isActive = (href: string) => location === href || (href === "/" && location === "/");

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center">
                  <span className="text-midnight font-bold text-lg">E</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold luxury-text">EGCU</h1>
                  <p className="text-xs text-silver tracking-wider">EGYPT CUT UP</p>
                </div>
              </div>
            </Link>
            <div className="hidden md:block ml-12">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link px-4 py-2 text-sm font-medium tracking-wide ${
                      isActive(item.href)
                        ? "active text-electric-blue"
                        : "text-platinum hover:text-electric-blue"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/admin"
                    className={`nav-link px-4 py-2 text-sm font-medium tracking-wide ${
                      isActive("/admin")
                        ? "active text-electric-blue"
                        : "text-platinum hover:text-electric-blue"
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            {!isAuthenticated ? (
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="btn-primary px-6 py-2.5 rounded-full font-medium"
              >
                <User className="h-4 w-4 mr-2" />
                Admin Access
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-platinum text-sm font-medium">
                  {user?.firstName || user?.email || 'Admin'}
                </span>
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  className="border-white/20 text-platinum hover:bg-white/10 rounded-full px-4 py-2"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-platinum hover:text-electric-blue"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 glass-card border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-electric-blue text-midnight"
                    : "text-platinum hover:bg-white/10 hover:text-electric-blue"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/admin"
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                  isActive("/admin")
                    ? "bg-electric-blue text-midnight"
                    : "text-platinum hover:bg-white/10 hover:text-electric-blue"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-4 border-t border-white/10">
              {!isAuthenticated ? (
                <Button
                  onClick={() => {
                    window.location.href = "/api/login";
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full btn-primary rounded-xl py-3"
                >
                  <User className="h-4 w-4 mr-2" />
                  Admin Access
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-platinum text-sm px-4 font-medium">
                    {user?.firstName || user?.email || 'Admin'}
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = "/api/logout";
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-white/20 text-platinum hover:bg-white/10 rounded-xl py-3"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
