import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        window.location.href = "/";
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-platinum bg-gradient-to-br from-midnight via-charcoal to-midnight">
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-midnight/50"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-electric-blue rounded-xl flex items-center justify-center">
              <span className="text-midnight font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-3xl font-light luxury-text">EGCU</h1>
              <p className="text-xs text-silver tracking-wider">EGYPT CUT UP</p>
            </div>
          </div>
        </div>

        <Card className="premium-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-light text-platinum tracking-wide">Admin Access</CardTitle>
            <CardDescription className="text-silver">
              Enter your credentials to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-silver tracking-wide">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-silver" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-platinum placeholder-silver focus:border-electric-blue rounded-xl"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-silver tracking-wide">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-silver" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-platinum placeholder-silver focus:border-electric-blue rounded-xl"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 rounded-xl font-medium tracking-wide"
              >
                {isLoading ? "Authenticating..." : "Access Dashboard"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-silver text-sm">
                Demo credentials: admin / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}