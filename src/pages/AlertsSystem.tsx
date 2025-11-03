import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  Mail,
  Clock,
  Target
} from "lucide-react";
import { employeeDatabase } from "@/data/attritionData";
import { predictAttrition } from "@/ml/attritionModel";
import { toast } from "sonner";

import { Employee } from "@/data/attritionData";

interface RiskAlert {
  id: string;
  employee: Employee;
  riskScore: number;
  riskLevel: string;
  priority: "urgent" | "high" | "medium";
  timestamp: string;
  status: "new" | "viewed" | "action_taken";
  topFactors: Array<{ factor: string; impact: number }>;
}

const AlertsSystem = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [alertStatus, setAlertStatus] = useState<Record<string, string>>({});

  // Generate alerts for high-risk employees
  const alerts = useMemo(() => {
    const highRiskAlerts: RiskAlert[] = employeeDatabase
      .map(emp => {
        const prediction = predictAttrition(emp);
        return {
          id: emp.id,
          employee: emp,
          riskScore: prediction.riskScore,
          riskLevel: prediction.attritionRisk,
          priority: prediction.riskScore >= 75 ? "urgent" : 
                   prediction.riskScore >= 60 ? "high" : "medium",
          timestamp: new Date().toISOString(),
          status: alertStatus[emp.id] || "new",
          topFactors: prediction.topFactors
        } as RiskAlert;
      })
      .filter(alert => alert.riskScore >= 50) // Only show medium+ risk
      .sort((a, b) => b.riskScore - a.riskScore);

    return highRiskAlerts;
  }, [alertStatus]);

  const urgentAlerts = alerts.filter(a => a.priority === "urgent");
  const highAlerts = alerts.filter(a => a.priority === "high");
  const newAlerts = alerts.filter(a => a.status === "new");

  const markAsViewed = (alertId: string) => {
    setAlertStatus(prev => ({ ...prev, [alertId]: "viewed" }));
    toast.success("Alert marked as viewed");
  };

  const markActionTaken = (alertId: string) => {
    setAlertStatus(prev => ({ ...prev, [alertId]: "action_taken" }));
    toast.success("Action recorded for this alert");
  };

  const sendNotification = (alert: RiskAlert) => {
    toast.success(`Notification sent to manager for ${alert.employee.id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50 dark:bg-red-950 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200";
      default: return "";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "high": return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge variant="destructive">New</Badge>;
      case "viewed": return <Badge variant="default">Viewed</Badge>;
      case "action_taken": return <Badge variant="secondary">Action Taken</Badge>;
      default: return null;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedTab === "all") return true;
    if (selectedTab === "urgent") return alert.priority === "urgent";
    if (selectedTab === "high") return alert.priority === "high";
    if (selectedTab === "new") return alert.status === "new";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Risk Alert System
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of high-risk employees
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Urgent</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentAlerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{highAlerts.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">New Alerts</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{newAlerts.length}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Employees requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
                <TabsTrigger value="urgent">Urgent ({urgentAlerts.length})</TabsTrigger>
                <TabsTrigger value="high">High ({highAlerts.length})</TabsTrigger>
                <TabsTrigger value="new">New ({newAlerts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4 mt-6">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={`border-2 ${getPriorityColor(alert.priority)}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getPriorityIcon(alert.priority)}
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{alert.employee.id}</h3>
                                {getStatusBadge(alert.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {alert.employee.jobRole} - {alert.employee.department}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                Detected just now
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Risk Score</p>
                            <p className="text-2xl font-bold text-red-600">{alert.riskScore}%</p>
                          </div>
                        </div>

                        {/* Risk Progress */}
                        <div className="space-y-2">
                          <Progress value={alert.riskScore} className="h-2" />
                        </div>

                        {/* Top Risk Factors */}
                        <div>
                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Top Risk Factors
                          </p>
                          <div className="grid gap-2 md:grid-cols-2">
                            {alert.topFactors.slice(0, 3).map((factor, idx) => (
                              <div key={idx} className="bg-background rounded-lg p-3 border">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{factor.factor}</span>
                                  <span className="text-xs text-muted-foreground">{factor.impact.toFixed(0)}%</span>
                                </div>
                                <Progress value={factor.impact} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/dashboard?search=${alert.id}`}
                          >
                            View Full Analysis
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendNotification(alert)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Notify Manager
                          </Button>
                          {alert.status === "new" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markAsViewed(alert.id)}
                            >
                              Mark as Viewed
                            </Button>
                          )}
                          {alert.status === "viewed" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markActionTaken(alert.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark Action Taken
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredAlerts.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
                    <p className="text-muted-foreground">
                      No {selectedTab !== "all" ? selectedTab : ""} alerts at this time
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Configuration</CardTitle>
            <CardDescription>Configure alert thresholds and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Urgent:</strong> Risk score ≥ 75% | 
                <strong className="ml-2">High:</strong> Risk score ≥ 60% | 
                <strong className="ml-2">Medium:</strong> Risk score ≥ 50%
              </AlertDescription>
            </Alert>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline">
                Configure Email Notifications
              </Button>
              <Button variant="outline">
                Set Custom Thresholds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsSystem;
