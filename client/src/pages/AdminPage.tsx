import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPanel from "@/components/AdminPanel";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function AdminPage() {
  const { user, isLoading, logoutMutation } = useAuth();
  
  // Handle logout
  function handleLogout() {
    logoutMutation.mutate();
  }

  // If not authenticated, redirect to auth page
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-start">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <h2 className="text-lg font-medium">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </Button>
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
}
