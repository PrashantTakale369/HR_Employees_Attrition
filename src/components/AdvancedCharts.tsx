import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Employee } from "@/data/attritionData";

interface AdvancedChartsProps {
  employees: Employee[];
}

export const AdvancedCharts = ({ employees }: AdvancedChartsProps) => {
  // Satisfaction Radar Chart
  const radarData = [
    {
      metric: "Job Satisfaction",
      attrition: employees.filter(e => e.attrition).reduce((acc, e) => acc + e.jobSatisfaction, 0) / employees.filter(e => e.attrition).length || 0,
      retained: employees.filter(e => !e.attrition).reduce((acc, e) => acc + e.jobSatisfaction, 0) / employees.filter(e => !e.attrition).length || 0,
    },
    {
      metric: "Work-Life Balance",
      attrition: employees.filter(e => e.attrition).reduce((acc, e) => acc + e.workLifeBalance, 0) / employees.filter(e => e.attrition).length || 0,
      retained: employees.filter(e => !e.attrition).reduce((acc, e) => acc + e.workLifeBalance, 0) / employees.filter(e => !e.attrition).length || 0,
    },
    {
      metric: "Environment",
      attrition: employees.filter(e => e.attrition).reduce((acc, e) => acc + e.environmentSatisfaction, 0) / employees.filter(e => e.attrition).length || 0,
      retained: employees.filter(e => !e.attrition).reduce((acc, e) => acc + e.environmentSatisfaction, 0) / employees.filter(e => !e.attrition).length || 0,
    },
    {
      metric: "Relationships",
      attrition: employees.filter(e => e.attrition).reduce((acc, e) => acc + e.relationshipSatisfaction, 0) / employees.filter(e => e.attrition).length || 0,
      retained: employees.filter(e => !e.attrition).reduce((acc, e) => acc + e.relationshipSatisfaction, 0) / employees.filter(e => !e.attrition).length || 0,
    },
    {
      metric: "Performance",
      attrition: employees.filter(e => e.attrition).reduce((acc, e) => acc + e.performanceRating, 0) / employees.filter(e => e.attrition).length || 0,
      retained: employees.filter(e => !e.attrition).reduce((acc, e) => acc + e.performanceRating, 0) / employees.filter(e => !e.attrition).length || 0,
    },
  ];

  // Income vs Age Scatter
  const scatterData = employees.slice(0, 100).map(e => ({
    age: e.age,
    income: e.monthlyIncome,
    attrition: e.attrition,
  }));

  // Overtime Impact
  const overtimeData = [
    {
      category: "With Overtime",
      attrition: employees.filter(e => e.overTime && e.attrition).length,
      retained: employees.filter(e => e.overTime && !e.attrition).length,
    },
    {
      category: "No Overtime",
      attrition: employees.filter(e => !e.overTime && e.attrition).length,
      retained: employees.filter(e => !e.overTime && !e.attrition).length,
    },
  ];

  // Distance Impact
  const distanceData = [
    { range: "0-5 km", count: 0, attrition: 0 },
    { range: "6-10 km", count: 0, attrition: 0 },
    { range: "11-20 km", count: 0, attrition: 0 },
    { range: "20+ km", count: 0, attrition: 0 },
  ];

  employees.forEach(e => {
    let index = 0;
    if (e.distanceFromHome <= 5) index = 0;
    else if (e.distanceFromHome <= 10) index = 1;
    else if (e.distanceFromHome <= 20) index = 2;
    else index = 3;
    
    distanceData[index].count++;
    if (e.attrition) distanceData[index].attrition++;
  });

  distanceData.forEach(d => {
    d.attrition = (d.attrition / d.count) * 100;
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Satisfaction Profile Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--foreground))" />
              <PolarRadiusAxis angle={90} domain={[0, 4]} stroke="hsl(var(--foreground))" />
              <Radar
                name="Left Company"
                dataKey="attrition"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.3}
              />
              <Radar
                name="Retained"
                dataKey="retained"
                stroke="hsl(var(--success))"
                fill="hsl(var(--success))"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Income vs Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="age"
                name="Age"
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                type="number"
                dataKey="income"
                name="Income"
                stroke="hsl(var(--foreground))"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Scatter name="Employees" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.attrition ? "hsl(var(--destructive))" : "hsl(var(--chart-1))"}
                  />
                ))}
              </Scatter>
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Overtime Impact on Attrition</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={overtimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="attrition"
                fill="hsl(var(--destructive))"
                stroke="hsl(var(--destructive))"
                fillOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="retained"
                stroke="hsl(var(--success))"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Commute Distance Attrition Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={distanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="range" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="attrition"
                fill="hsl(var(--warning))"
                stroke="hsl(var(--warning))"
                fillOpacity={0.4}
              />
              <Line
                type="monotone"
                dataKey="attrition"
                stroke="hsl(var(--destructive))"
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
