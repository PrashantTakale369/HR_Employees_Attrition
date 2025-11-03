import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Lock, Mail, Users, TrendingUp, Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await login(email, password);
    
    setIsLoading(false);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="bg-primary rounded-2xl p-3">
                <BarChart3 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HR Insights
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Advanced Employee Attrition Analytics & Prediction Platform
            </p>
          </div>

          <div className="space-y-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl p-8">
            <h2 className="text-2xl font-semibold">Platform Features</h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor workforce trends and attrition patterns in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Employee Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive employee data and attrition risk analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2">
                  <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">ML Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered attrition prediction with advanced algorithms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-2">
                  <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade security with role-based access control
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full shadow-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center lg:hidden mb-4">
              <div className="bg-primary rounded-2xl p-3">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your HR analytics dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
