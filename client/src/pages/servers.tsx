import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ServerCard from "@/components/server-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Server } from "@shared/schema";

export default function Servers() {
  const { data: servers, isLoading, error } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      <Navigation />
      
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Server Status</h1>
            <p className="text-gray-400">Live status of our Assetto Corsa servers across regions</p>
          </div>
          
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-card border border-dark-border rounded-lg p-6">
                  <Skeleton className="h-6 w-3/4 mb-4 bg-gray-700" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20 bg-gray-700" />
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                      <Skeleton className="h-4 w-24 bg-gray-700" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12 bg-gray-700" />
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                    </div>
                    <Skeleton className="h-2 w-full bg-gray-700" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4 bg-gray-700" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Failed to load servers</h3>
              <p className="text-gray-400">Please try again later</p>
            </div>
          )}

          {servers && servers.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-2">No servers available</h3>
              <p className="text-gray-400">Check back later for server updates</p>
            </div>
          )}

          {servers && servers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
