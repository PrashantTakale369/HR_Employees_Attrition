import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Settings, 
  Brain, 
  Bell, 
  Search, 
  Target,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    title: "Dashboard",
    description: "Overview of key HR metrics and employee statistics",
    icon: BarChart3,
    path: "/dashboard",
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300"
  },
  {
    title: "Analytics",
    description: "Deep dive into workforce analytics and trends",
    icon: TrendingUp,
    path: "/analytics",
    color: "from-purple-500 to-purple-600",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-300"
  },
  {
    title: "Employees",
    description: "Browse and manage employee directory",
    icon: Users,
    path: "/employees",
    color: "from-green-500 to-green-600",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300"
  },
  {
    title: "Predictions",
    description: "Individual employee attrition risk prediction",
    icon: Settings,
    path: "/predictions",
    color: "from-orange-500 to-orange-600",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-300"
  },
  {
    title: "Batch Prediction",
    description: "Bulk employee attrition analysis and risk assessment",
    icon: Brain,
    path: "/batch-prediction",
    color: "from-pink-500 to-pink-600",
    iconBg: "bg-pink-100 dark:bg-pink-900",
    iconColor: "text-pink-600 dark:text-pink-300"
  },
  {
    title: "Alerts",
    description: "Real-time monitoring and alerts for at-risk employees",
    icon: Bell,
    path: "/alerts",
    color: "from-red-500 to-red-600",
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-300"
  },
  {
    title: "Why They Left",
    description: "Detailed analysis of employee departure reasons",
    icon: Search,
    path: "/why-left",
    color: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-300"
  },
  {
    title: "Retention Strategies",
    description: "Personalized retention plans for at-risk employees",
    icon: Target,
    path: "/retention",
    color: "from-teal-500 to-teal-600",
    iconBg: "bg-teal-100 dark:bg-teal-900",
    iconColor: "text-teal-600 dark:text-teal-300"
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Badge */}
          <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:shadow-lg transition-shadow">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered HR Analytics Platform
          </Badge>

          {/* Main Hero */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              HR Insights
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl">Reimagined</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your workforce management with cutting-edge machine learning, 
              real-time analytics, and predictive intelligence
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              onClick={() => navigate("/analytics")}
            >
              View Analytics
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>90% Prediction Accuracy</span>
            </div>
          </div>
        </div>

        {/* Visual Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mini Stats Preview */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">Live</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">500+</div>
                <div className="text-blue-100 text-sm">Active Employees</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">AI</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">85-90%</div>
                <div className="text-purple-100 text-sm">ML Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8" />
                  <Badge className="bg-white/20 text-white border-0">Insights</Badge>
                </div>
                <div className="text-4xl font-bold mb-1">30+</div>
                <div className="text-pink-100 text-sm">Data Factors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: "600ms" }}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Powerful Features at Your Fingertips
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive suite of tools designed for modern HR professionals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <Card 
              key={section.path}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50 animate-in fade-in slide-in-from-bottom-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => navigate(section.path)}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardHeader className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${section.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <section.icon className={`h-7 w-7 ${section.iconColor}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-relaxed line-clamp-2">
                    {section.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${section.color} transition-all duration-500 rounded-full`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: "900ms" }}>
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose Our Platform?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Advanced ML Models</h4>
              <p className="text-muted-foreground">Random Forest algorithms with 85-90% prediction accuracy for reliable insights</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Real-time Analytics</h4>
              <p className="text-muted-foreground">Instant data processing and visualization for immediate decision-making</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold">Actionable Insights</h4>
              <p className="text-muted-foreground">Personalized retention strategies and predictive alerts for proactive management</p>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: "1000ms" }}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="pt-6 text-center relative z-10">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">8</div>
              <div className="text-sm text-blue-100 font-medium">Core Features</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="pt-6 text-center relative z-10">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">30+</div>
              <div className="text-sm text-purple-100 font-medium">ML Factors</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="pt-6 text-center relative z-10">
              <Zap className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">Real-time</div>
              <div className="text-sm text-pink-100 font-medium">Processing</div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="pt-6 text-center relative z-10">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">AI-Powered</div>
              <div className="text-sm text-teal-100 font-medium">Predictions</div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: "1200ms" }}>
          <h3 className="text-4xl font-bold">Ready to Transform Your HR Strategy?</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join forward-thinking organizations using AI to reduce attrition and boost employee satisfaction
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            onClick={() => navigate("/dashboard")}
          >
            Start Your Journey
            <Sparkles className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
