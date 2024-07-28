import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import ScenarioList from "../components/ScenarioList";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Play, BarChart2, Settings } from "lucide-react";

const Index = () => {
  const { session } = useSupabaseAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Lovable Benchmarks Dashboard</h1>
        
        {session ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scenarios</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Benchmarks Run</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">120</div>
                  <p className="text-xs text-muted-foreground">+15 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground">+2% from last quarter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+3 new this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Create new scenarios or start benchmarks</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/create-scenario">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Scenario
                    </Link>
                  </Button>
                  <Button asChild className="w-full" size="lg">
                    <Link to="/start-benchmark">
                      <Play className="mr-2 h-5 w-5" />
                      Start Benchmark
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest benchmarks and scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>New scenario "Web App Performance" created</li>
                    <li>Benchmark "API Response Time" completed</li>
                    <li>Updated "User Authentication" scenario</li>
                    <li>Started benchmark for "Database Query Optimization"</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Scenarios</CardTitle>
                <CardDescription>Manage and view your benchmark scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <ScenarioList />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Lovable Benchmarks</CardTitle>
              <CardDescription>
                A cutting-edge tool for automated benchmarking of GPT Engineer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our platform provides comprehensive insights into the performance and capabilities of AI-driven engineering solutions.
              </p>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;