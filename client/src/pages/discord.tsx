import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { Trophy, Download, Users } from "lucide-react";
import { DiscordStats } from "@shared/schema";

export default function Discord() {
  const { data: stats } = useQuery<DiscordStats>({
    queryKey: ["/api/discord/stats"],
    retry: false,
  });

  // Fallback stats if API data is not available
  const displayStats = stats || {
    totalMembers: 11247,
    onlineMembers: 573,
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Join Our Community</h1>
            <p className="text-gray-400 text-lg">Connect with 11,000+ racing enthusiasts in our Discord server</p>
          </div>

          {/* Discord Server Info */}
          <div className="discord-gradient bg-dark-card border border-dark-border rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <SiDiscord className="text-6xl text-indigo-400 mr-4" />
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white">Egypt Cut Up Discord</h3>
                    <p className="text-indigo-300">Official Community Server</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{displayStats.totalMembers.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Total Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{displayStats.onlineMembers.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">Online Now</div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4"
                  onClick={() => window.open("https://discord.gg/egcu", "_blank")}
                >
                  <SiDiscord className="h-5 w-5 mr-2" />
                  Join Discord
                </Button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <Trophy className="h-12 w-12 text-gold-accent mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Weekly Tournaments</h4>
              <p className="text-gray-400">Compete in organized racing events with prizes and recognition</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <Download className="h-12 w-12 text-racing-red mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Mod Sharing</h4>
              <p className="text-gray-400">Access exclusive car mods, tracks, and custom content</p>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <Users className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Active Community</h4>
              <p className="text-gray-400">24/7 active chat and voice channels with passionate racers</p>
            </div>
          </div>

          {/* Community Highlights */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Community Highlights</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-racing-red mb-2">🏆 EGCU Championship Series</h3>
                <p className="text-gray-400 text-sm mb-4">Monthly championship events with cash prizes and exclusive rewards for top performers.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-accent mb-2">🚗 Custom Car Releases</h3>
                <p className="text-gray-400 text-sm mb-4">Regular releases of Egyptian-themed and MENA-inspired car modifications.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">🎯 Daily Challenges</h3>
                <p className="text-gray-400 text-sm mb-4">Daily racing challenges and time trials to keep the competition active.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">📺 Live Streaming Events</h3>
                <p className="text-gray-400 text-sm mb-4">Weekly live streams featuring community races and behind-the-scenes content.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
