import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target,
  TrendingUp, 
  Users, 
  DollarSign,
  Award,
  Heart,
  Clock,
  BookOpen,
  CheckCircle2,
  Star,
  LucideIcon
} from "lucide-react";
import { employeeDatabase } from "@/data/attritionData";
import { predictAttrition } from "@/ml/attritionModel";

interface RetentionStrategy {
  employeeId: string;
  riskScore: number;
  priority: "urgent" | "high" | "medium";
  strategies: {
    category: string;
    action: string;
    timeline: string;
    impact: "high" | "medium" | "low";
    cost: "high" | "medium" | "low";
    icon: LucideIcon;
  }[];
  estimatedEffectiveness: number;
}

const RetentionStrategies = () => {
  const [selectedTab, setSelectedTab] = useState("urgent");

  const retentionPlans = useMemo(() => {
    const plans: RetentionStrategy[] = employeeDatabase
      .map(emp => {
        const prediction = predictAttrition(emp);
        if (prediction.riskScore < 50) return null;

        const strategies = [];

        // Compensation Strategy
        if (prediction.topFactors.some(f => f.factor.includes("Income") || f.factor.includes("Salary"))) {
          strategies.push({
            category: "Compensation",
            action: `Salary review and adjustment (+10-15% market rate comparison)`,
            timeline: "Immediate (1-2 weeks)",
            impact: "high" as const,
            cost: "high" as const,
            icon: DollarSign
          });
        }

        // Work-Life Balance Strategy
        if (emp.overTime || emp.workLifeBalance <= 2) {
          strategies.push({
            category: "Work-Life Balance",
            action: "Reduce overtime, implement flexible schedule, remote work options",
            timeline: "Short-term (2-4 weeks)",
            impact: "high" as const,
            cost: "low" as const,
            icon: Heart
          });
        }

        // Career Development
        if (emp.trainingTimesLastYear === 0 || emp.yearsAtCompany >= 5) {
          strategies.push({
            category: "Career Development",
            action: "Create personalized development plan, assign mentor, discuss promotion path",
            timeline: "Medium-term (1-3 months)",
            impact: "high" as const,
            cost: "medium" as const,
            icon: TrendingUp
          });
        }

        // Recognition & Rewards
        if (emp.performanceRating >= 3) {
          strategies.push({
            category: "Recognition",
            action: "Employee recognition program, spot bonuses, public acknowledgment",
            timeline: "Immediate (1 week)",
            impact: "medium" as const,
            cost: "low" as const,
            icon: Award
          });
        }

        // Training & Skills
        strategies.push({
          category: "Professional Development",
          action: "Enroll in training programs, conference attendance, certification support",
          timeline: "Medium-term (2-3 months)",
          impact: "medium" as const,
          cost: "medium" as const,
          icon: BookOpen
        });

        // Job Satisfaction
        if (emp.jobSatisfaction <= 2) {
          strategies.push({
            category: "Job Redesign",
            action: "One-on-one discussion, role adjustment, task variety increase",
            timeline: "Short-term (2-4 weeks)",
            impact: "high" as const,
            cost: "low" as const,
            icon: Star
          });
        }

        // Team & Relationships
        if (emp.relationshipSatisfaction <= 2) {
          strategies.push({
            category: "Team Building",
            action: "Team building activities, manager coaching, conflict resolution",
            timeline: "Short-term (1 month)",
            impact: "medium" as const,
            cost: "low" as const,
            icon: Users
          });
        }

        const effectiveness = strategies.filter(s => s.impact === "high").length * 25 + 
                            strategies.filter(s => s.impact === "medium").length * 15;

        return {
          employeeId: emp.id,
          riskScore: prediction.riskScore,
          priority: prediction.riskScore >= 75 ? "urgent" : 
                   prediction.riskScore >= 60 ? "high" : "medium",
          strategies: strategies.slice(0, 5),
          estimatedEffectiveness: Math.min(effectiveness, 85)
        } as RetentionStrategy;
      })
      .filter(Boolean) as RetentionStrategy[];

    return plans.sort((a, b) => b.riskScore - a.riskScore);
  }, []);

  const urgentPlans = retentionPlans.filter(p => p.priority === "urgent");
  const highPlans = retentionPlans.filter(p => p.priority === "high");
  const mediumPlans = retentionPlans.filter(p => p.priority === "medium");

  const getImpactBadge = (impact: string): "destructive" | "default" | "secondary" => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "";
    }
  };

  const filteredPlans = retentionPlans.filter(plan => {
    if (selectedTab === "all") return true;
    return plan.priority === selectedTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Retention Strategies
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized retention plans for at-risk employees
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold">{retentionPlans.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Urgent</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentPlans.length}</p>
                </div>
                <Target className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{highPlans.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Medium Priority</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mediumPlans.length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retention Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Retention Plans</CardTitle>
            <CardDescription>Actionable strategies tailored to each at-risk employee</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="urgent">Urgent ({urgentPlans.length})</TabsTrigger>
                <TabsTrigger value="high">High ({highPlans.length})</TabsTrigger>
                <TabsTrigger value="medium">Medium ({mediumPlans.length})</TabsTrigger>
                <TabsTrigger value="all">All ({retentionPlans.length})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4 mt-6">
                {filteredPlans.map((plan) => (
                  <Card key={plan.employeeId} className="border-2">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{plan.employeeId}</h3>
                              <Badge variant={plan.priority === "urgent" ? "destructive" : "default"}>
                                {plan.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Risk Score: {plan.riskScore}% | Estimated Effectiveness: {plan.estimatedEffectiveness}%
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/dashboard?search=${plan.employeeId}`}
                          >
                            View Profile
                          </Button>
                        </div>

                        {/* Effectiveness Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan Effectiveness</span>
                            <span className="font-medium">{plan.estimatedEffectiveness}%</span>
                          </div>
                          <Progress value={plan.estimatedEffectiveness} className="h-2" />
                        </div>

                        {/* Strategies */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Recommended Actions
                          </h4>
                          {plan.strategies.map((strategy, idx) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  <div className="bg-primary/10 p-2 rounded-lg">
                                    <strategy.icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                      <div className="flex-1">
                                        <h5 className="font-semibold">{strategy.category}</h5>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {strategy.action}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Badge variant={getImpactBadge(strategy.impact)}>
                                          {strategy.impact} impact
                                        </Badge>
                                        <Badge variant="outline" className={getCostColor(strategy.cost)}>
                                          {strategy.cost} cost
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {strategy.timeline}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button size="sm" variant="default">
                            Implement Plan
                          </Button>
                          <Button size="sm" variant="outline">
                            Schedule Meeting
                          </Button>
                          <Button size="sm" variant="outline">
                            Export PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredPlans.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Plans</h3>
                    <p className="text-muted-foreground">
                      No {selectedTab !== "all" ? selectedTab : ""} retention plans at this time
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RetentionStrategies;
