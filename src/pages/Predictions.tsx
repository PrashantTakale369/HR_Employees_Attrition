import { useMemo } from "react";
import { employeeDatabase } from "@/data/attritionData";
import { predictAttrition } from "@/ml/attritionModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, TrendingUp, Users, Target } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

const Predictions = () => {
  const predictions = useMemo(() => {
    return employeeDatabase
      .filter(emp => !emp.attrition)
      .map(emp => ({
        employee: emp,
        prediction: predictAttrition(emp),
      }))
      .sort((a, b) => b.prediction.riskScore - a.prediction.riskScore);
  }, []);

  const highRisk = predictions.filter(p => p.prediction.attritionRisk === "High");
  const mediumRisk = predictions.filter(p => p.prediction.attritionRisk === "Medium");
  const lowRisk = predictions.filter(p => p.prediction.attritionRisk === "Low");

  const riskDistribution = [
    { name: "High Risk", value: highRisk.length, color: "hsl(var(--destructive))" },
    { name: "Medium Risk", value: mediumRisk.length, color: "hsl(var(--warning))" },
    { name: "Low Risk", value: lowRisk.length, color: "hsl(var(--success))" },
  ];

  const departmentRisk = Object.entries(
    predictions.reduce((acc, p) => {
      const dept = p.employee.department;
      if (!acc[dept]) acc[dept] = { high: 0, medium: 0, low: 0 };
      if (p.prediction.attritionRisk === "High") acc[dept].high++;
      else if (p.prediction.attritionRisk === "Medium") acc[dept].medium++;
      else acc[dept].low++;
      return acc;
    }, {} as Record<string, { high: number; medium: number; low: number }>)
  ).map(([name, data]) => ({
    name,
    high: data.high,
    medium: data.medium,
    low: data.low,
  }));

  const topFactors = predictions
    .flatMap(p => p.prediction.topFactors)
    .reduce((acc, factor) => {
      const existing = acc.find(f => f.factor === factor.factor);
      if (existing) {
        existing.count++;
        existing.totalImpact += factor.impact;
      } else {
        acc.push({ factor: factor.factor, count: 1, totalImpact: factor.impact });
      }
      return acc;
    }, [] as Array<{ factor: string; count: number; totalImpact: number }>)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Attrition Predictions & Risk Analysis</h1>
          <p className="text-muted-foreground mt-1">
            ML-powered insights for {predictions.length} active employees
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="High Risk Employees"
            value={highRisk.length}
            icon={AlertTriangle}
            trend={`${((highRisk.length / predictions.length) * 100).toFixed(1)}% of workforce`}
            trendUp={false}
          />
          <MetricCard
            title="Medium Risk"
            value={mediumRisk.length}
            icon={TrendingUp}
            trend={`${((mediumRisk.length / predictions.length) * 100).toFixed(1)}% of workforce`}
          />
          <MetricCard
            title="Low Risk"
            value={lowRisk.length}
            icon={Users}
            trend={`${((lowRisk.length / predictions.length) * 100).toFixed(1)}% of workforce`}
            trendUp={true}
          />
          <MetricCard
            title="Avg Risk Score"
            value={(predictions.reduce((acc, p) => acc + p.prediction.riskScore, 0) / predictions.length).toFixed(1)}
            icon={Target}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Risk by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentRisk}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="high" stackId="a" fill="hsl(var(--destructive))" />
                  <Bar dataKey="medium" stackId="a" fill="hsl(var(--warning))" />
                  <Bar dataKey="low" stackId="a" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top Risk Factors Across Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFactors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" />
                <YAxis dataKey="factor" type="category" stroke="hsl(var(--foreground))" width={200} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              High Risk Employees (Top 10)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highRisk.slice(0, 10).map(({ employee, prediction }) => (
              <div
                key={employee.id}
                className="p-4 border rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{employee.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {employee.jobRole} • {employee.department}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {prediction.riskScore}/100
                  </Badge>
                </div>
                
                <Progress value={prediction.riskScore} className="h-2 mb-3" />
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Top Factors:</p>
                  {prediction.topFactors.slice(0, 3).map((factor, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {factor.factor} ({factor.impact.toFixed(0)}% impact)
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Predictions;
