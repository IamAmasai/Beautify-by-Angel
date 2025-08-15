import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-plum)]">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Beautify by Angel admin panel</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Website Overview</CardTitle>
            <CardDescription>
              General website statistics and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Website is running smoothly. All services are properly displayed.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Manage beauty service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Hair braiding, makeup artistry, nail artistry, and henna services are active.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Customer contact details for appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Customers can reach out via the contact page or phone: +254 123 456 789
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}