import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminPanel from "@/components/AdminPanel";

// Form validation schema
const loginSchema = z.object({
  username: z.string()
    .min(1, { message: "Username is required" }),
  password: z.string()
    .min(1, { message: "Password is required" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already authenticated
  const { data: authStatus, isLoading: checkingAuth } = useQuery({
    queryKey: ['/api/admin/check-auth'],
    onSuccess: (data) => {
      if (data && data.authenticated) {
        setIsAuthenticated(true);
      }
    },
    // Return null if unauthorized instead of throwing
    queryFn: ({ queryKey }) => fetch(queryKey[0] as string, { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) return { authenticated: false };
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        return res.json();
      })
  });
  
  // Form setup
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await apiRequest('POST', '/api/admin/login', data);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check-auth'] });
      toast({
        title: "Login Successful",
        description: "Welcome back, Angel!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/admin/logout', {});
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/check-auth'] });
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
        variant: "default",
      });
    },
  });
  
  function onSubmit(data: LoginForm) {
    loginMutation.mutate(data);
  }
  
  function handleLogout() {
    logoutMutation.mutate();
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-start">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Loading...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your credentials
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-plum)]">Admin Dashboard</h1>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="border-[var(--color-plum)] text-[var(--color-plum)]"
            >
              Logout
            </Button>
          </div>
          
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex justify-center items-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-[var(--color-plum)] hover:bg-[var(--color-plum)]/90"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
