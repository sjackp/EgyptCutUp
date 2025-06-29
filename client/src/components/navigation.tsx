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
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-racing-red text-white"
                        : "text-gray-300 hover:bg-dark-border hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/admin"
                    className={`nav-link px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/admin")
                        ? "bg-racing-red text-white"
                        : "text-gray-300 hover:bg-dark-border hover:text-white"
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
                className="bg-gold-accent text-dark-bg hover:bg-yellow-500"
              >
                <User className="h-4 w-4 mr-2" />
                Admin Login
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  Welcome, {user?.firstName || user?.email || 'Admin'}
                </span>
                <Button
                  onClick={() => window.location.href = "/api/logout"}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
              className="text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-card border-t border-dark-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-racing-red text-white"
                    : "text-gray-300 hover:bg-dark-border hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin")
                    ? "bg-racing-red text-white"
                    : "text-gray-300 hover:bg-dark-border hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-4 border-t border-dark-border">
              {!isAuthenticated ? (
                <Button
                  onClick={() => {
                    window.location.href = "/api/login";
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gold-accent text-dark-bg hover:bg-yellow-500"
                >
                  <User className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm px-3">
                    Welcome, {user?.firstName || user?.email || 'Admin'}
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = "/api/logout";
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
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
