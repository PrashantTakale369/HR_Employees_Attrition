import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter, ScatterChart, ZAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { employeeDatabase } from "@/data/attritionData";
import { Badge } from "@/components/ui/badge";

const COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
  gradient1: "rgba(59, 130, 246, 0.8)",
  gradient2: "rgba(147, 51, 234, 0.8)",
  gradient3: "rgba(236, 72, 153, 0.8)",
  gradient4: "rgba(251, 146, 60, 0.8)",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6"
};

const CHART_COLORS = [
  COLORS.gradient1, COLORS.gradient2, COLORS.gradient3, 
  COLORS.gradient4, COLORS.success, COLORS.warning
];

export const OverviewCharts = () => {
  // Department-wise attrition
  const departmentData = Object.entries(
    employeeDatabase.reduce((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, attrition: 0 };
      }
      acc[emp.department].total++;
      if (emp.attrition) acc[emp.department].attrition++;
      return acc;
    }, {} as Record<string, { total: number; attrition: number }>)
  ).map(([name, data]) => ({
    name,
    attritionRate: ((data.attrition / data.total) * 100).toFixed(1),
    count: data.attrition,
  }));

  // Age distribution
  const ageData = [
    { range: "20-30", count: 0 },
    { range: "31-40", count: 0 },
    { range: "41-50", count: 0 },
    { range: "51+", count: 0 },
  ];
  
  employeeDatabase.filter(e => e.attrition).forEach(emp => {
    if (emp.age <= 30) ageData[0].count++;
    else if (emp.age <= 40) ageData[1].count++;
    else if (emp.age <= 50) ageData[2].count++;
    else ageData[3].count++;
  });

  // Job Satisfaction
  const satisfactionData = [1, 2, 3, 4].map(level => ({
    level: `Level ${level}`,
    attrition: employeeDatabase.filter(e => e.jobSatisfaction === level && e.attrition).length,
    retained: employeeDatabase.filter(e => e.jobSatisfaction === level && !e.attrition).length,
  }));

  // Years at Company
  const tenureData = [
    { years: "0-2", count: 0 },
    { years: "3-5", count: 0 },
    { years: "6-10", count: 0 },
    { years: "11+", count: 0 },
  ];
  
  employeeDatabase.filter(e => e.attrition).forEach(emp => {
    if (emp.yearsAtCompany <= 2) tenureData[0].count++;
    else if (emp.yearsAtCompany <= 5) tenureData[1].count++;
    else if (emp.yearsAtCompany <= 10) tenureData[2].count++;
    else tenureData[3].count++;
  });

  // Advanced: Distance vs Attrition Correlation
  const distanceImpactData = Array.from({ length: 6 }, (_, i) => {
    const rangeStart = i * 5;
    const rangeEnd = rangeStart + 5;
    const inRange = employeeDatabase.filter(e => e.distanceFromHome >= rangeStart && e.distanceFromHome < rangeEnd);
    const attritionInRange = inRange.filter(e => e.attrition).length;
    
    return {
      range: `${rangeStart}-${rangeEnd} km`,
      attritionRate: inRange.length > 0 ? parseFloat(((attritionInRange / inRange.length) * 100).toFixed(1)) : 0,
      count: attritionInRange,
      total: inRange.length
    };
  }).filter(d => d.total > 0);

  // Advanced: Multi-factor Radar Chart
  const radarData = [
    {
      factor: 'Job Satisfaction',
      attrition: employeeDatabase.filter(e => e.attrition && e.jobSatisfaction <= 2).length / employeeDatabase.filter(e => e.attrition).length * 100,
      retained: employeeDatabase.filter(e => !e.attrition && e.jobSatisfaction >= 3).length / employeeDatabase.filter(e => !e.attrition).length * 100
    },
    {
      factor: 'Work-Life Balance',
      attrition: employeeDatabase.filter(e => e.attrition && e.workLifeBalance <= 2).length / employeeDatabase.filter(e => e.attrition).length * 100,
      retained: employeeDatabase.filter(e => !e.attrition && e.workLifeBalance >= 3).length / employeeDatabase.filter(e => !e.attrition).length * 100
    },
    {
      factor: 'Environment',
      attrition: employeeDatabase.filter(e => e.attrition && e.environmentSatisfaction <= 2).length / employeeDatabase.filter(e => e.attrition).length * 100,
      retained: employeeDatabase.filter(e => !e.attrition && e.environmentSatisfaction >= 3).length / employeeDatabase.filter(e => !e.attrition).length * 100
    },
    {
      factor: 'Training',
      attrition: employeeDatabase.filter(e => e.attrition && e.trainingTimesLastYear <= 2).length / employeeDatabase.filter(e => e.attrition).length * 100,
      retained: employeeDatabase.filter(e => !e.attrition && e.trainingTimesLastYear >= 3).length / employeeDatabase.filter(e => !e.attrition).length * 100
    },
    {
      factor: 'Relationships',
      attrition: employeeDatabase.filter(e => e.attrition && e.relationshipSatisfaction <= 2).length / employeeDatabase.filter(e => e.attrition).length * 100,
      retained: employeeDatabase.filter(e => !e.attrition && e.relationshipSatisfaction >= 3).length / employeeDatabase.filter(e => !e.attrition).length * 100
    }
  ];

  // Advanced: Attrition Trend by Tenure
  const tenureTrendData = Array.from({length: 15}, (_, i) => {
    const year = i + 1;
    const attritionAtYear = employeeDatabase.filter(e => e.yearsAtCompany === year && e.attrition).length;
    const totalAtYear = employeeDatabase.filter(e => e.yearsAtCompany === year).length;
    return {
      year: `Year ${year}`,
      attritionRate: totalAtYear > 0 ? (attritionAtYear / totalAtYear * 100) : 0,
      count: attritionAtYear,
      total: totalAtYear
    };
  }).filter(d => d.total > 0);

  // Advanced: Income Distribution by Department
  const incomeByDept = ['Sales', 'Research & Development', 'Human Resources'].map(dept => {
    const deptEmployees = employeeDatabase.filter(e => e.department === dept);
    const attritionEmps = deptEmployees.filter(e => e.attrition);
    const retainedEmps = deptEmployees.filter(e => !e.attrition);
    
    return {
      department: dept.replace('Research & Development', 'R&D'),
      avgIncomeAttrition: attritionEmps.length > 0 ? Math.round(attritionEmps.reduce((sum, e) => sum + e.monthlyIncome, 0) / attritionEmps.length) : 0,
      avgIncomeRetained: retainedEmps.length > 0 ? Math.round(retainedEmps.reduce((sum, e) => sum + e.monthlyIncome, 0) / retainedEmps.length) : 0,
      attritionCount: attritionEmps.length
    };
  });

  // Advanced: Overtime Impact Stacked Area
  const overtimeImpact = [
    { category: 'No Overtime', attrition: employeeDatabase.filter(e => !e.overTime && e.attrition).length, retained: employeeDatabase.filter(e => !e.overTime && !e.attrition).length },
    { category: 'With Overtime', attrition: employeeDatabase.filter(e => e.overTime && e.attrition).length, retained: employeeDatabase.filter(e => e.overTime && !e.attrition).length }
  ];

  // Advanced: Education Level Analysis
  const educationLevelData = [1, 2, 3, 4, 5].map(level => {
    const filtered = employeeDatabase.filter(e => e.education === level);
    const attrition = filtered.filter(e => e.attrition).length;
    const rate = filtered.length > 0 ? (attrition / filtered.length) * 100 : 0;
    
    const levelNames = ['Below College', 'College', 'Bachelor', 'Master', 'Doctor'];
    
    return {
      field: levelNames[level - 1] || `Level ${level}`,
      rate: parseFloat(rate.toFixed(1)),
      attrition,
      retained: filtered.length - attrition,
      total: filtered.length
    };
  }).filter(d => d.total > 0);

  // Advanced: Marital Status Impact
  const maritalStatusData = Object.entries(
    employeeDatabase.reduce((acc, emp) => {
      if (!acc[emp.maritalStatus]) acc[emp.maritalStatus] = { attrition: 0, total: 0 };
      acc[emp.maritalStatus].total++;
      if (emp.attrition) acc[emp.maritalStatus].attrition++;
      return acc;
    }, {} as Record<string, { attrition: number; total: number }>)
  ).map(([status, data]) => ({
    status,
    attritionRate: parseFloat(((data.attrition / data.total) * 100).toFixed(1)),
    count: data.attrition,
    total: data.total
  }));

  // Advanced: Job Role Attrition Ranking
  const jobRoleRanking = Object.entries(
    employeeDatabase.reduce((acc, emp) => {
      if (!acc[emp.jobRole]) acc[emp.jobRole] = { attrition: 0, total: 0, avgIncome: 0, totalIncome: 0 };
      acc[emp.jobRole].total++;
      acc[emp.jobRole].totalIncome += emp.monthlyIncome;
      if (emp.attrition) acc[emp.jobRole].attrition++;
      return acc;
    }, {} as Record<string, { attrition: number; total: number; avgIncome: number; totalIncome: number }>)
  ).map(([role, data]) => ({
    role: role.length > 18 ? role.substring(0, 18) + '...' : role,
    attritionRate: parseFloat(((data.attrition / data.total) * 100).toFixed(1)),
    count: data.attrition,
    total: data.total,
    avgIncome: Math.round(data.totalIncome / data.total)
  }))
  .filter(d => d.total >= 5) // Only roles with 5+ employees
  .sort((a, b) => b.attritionRate - a.attritionRate)
  .slice(0, 8); // Top 8 highest risk roles

  interface TooltipPayload {
    name: string;
    value: number | string;
    color: string;
    dataKey?: string;
    payload?: Record<string, unknown>;
  }

  interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Department & Demographics */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Department & Demographics Analysis
            <Badge variant="secondary">Advanced Insights</Badge>
          </h2>
          <p className="text-muted-foreground">Cross-departmental attrition patterns and workforce demographics</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 3D Department Analysis */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Department Attrition Rates</CardTitle>
              <CardDescription>Percentage comparison across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.gradient1} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.gradient1} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                  <YAxis stroke="hsl(var(--foreground))" label={{ value: 'Attrition %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="attritionRate" fill="url(#colorDept)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Enhanced Age Distribution */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Age Group Distribution</CardTitle>
              <CardDescription>Attrition breakdown by age demographics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <defs>
                    {CHART_COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.4}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ range, count, percent }) => `${range}: ${count} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    paddingAngle={5}
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} stroke="hsl(var(--background))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 2: Satisfaction & Engagement */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Satisfaction & Engagement Metrics
            <Badge variant="secondary">Multi-Factor Analysis</Badge>
          </h2>
          <p className="text-muted-foreground">Employee satisfaction levels and their impact on retention</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Radar Chart - Multi-factor Analysis */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow lg:col-span-1">
            <CardHeader>
              <CardTitle>Factor Impact Analysis</CardTitle>
              <CardDescription>Comparative factor strength</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Attrition Risk" dataKey="attrition" stroke={COLORS.danger} fill={COLORS.danger} fillOpacity={0.6} />
                  <Radar name="Retention Strength" dataKey="retained" stroke={COLORS.success} fill={COLORS.success} fillOpacity={0.4} />
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Satisfaction Stacked Bar */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow lg:col-span-2">
            <CardHeader>
              <CardTitle>Job Satisfaction Breakdown</CardTitle>
              <CardDescription>Attrition vs retention across satisfaction levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={satisfactionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAttrition" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="level" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="attrition" stackId="a" fill="url(#colorAttrition)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="retained" stackId="a" fill="url(#colorRetained)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 3: Tenure & Income Analysis */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Tenure & Compensation Insights
            <Badge variant="secondary">Predictive Trends</Badge>
          </h2>
          <p className="text-muted-foreground">Long-term trends and financial impact analysis</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tenure Trend Area Chart */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Attrition Rate by Tenure</CardTitle>
              <CardDescription>Trend analysis across years of service</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={tenureTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTenure" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.gradient2} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.gradient2} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="year" stroke="hsl(var(--foreground))" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--foreground))" label={{ value: 'Attrition %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="attritionRate" stroke={COLORS.gradient2} fillOpacity={1} fill="url(#colorTenure)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income by Department Comparison */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Average Income Comparison</CardTitle>
              <CardDescription>Attrition vs retained employees by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={incomeByDept} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="department" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" label={{ value: 'Avg Income ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="avgIncomeAttrition" fill={COLORS.gradient3} radius={[8, 8, 0, 0]} name="Attrition" />
                  <Bar dataKey="avgIncomeRetained" fill={COLORS.gradient4} radius={[8, 8, 0, 0]} name="Retained" />
                  <Line type="monotone" dataKey="attritionCount" stroke={COLORS.danger} strokeWidth={2} name="Count" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 4: Geographic & Performance Analysis */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Geographic & Performance Analysis
            <Badge variant="secondary">Behavioral Patterns</Badge>
          </h2>
          <p className="text-muted-foreground">Distance from home and performance rating impact on retention</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Distance from Home Impact */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Distance from Home Impact</CardTitle>
              <CardDescription>Attrition rate by commute distance ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={distanceImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="range" stroke="hsl(var(--foreground))" tick={{ fontSize: 11 }} />
                  <YAxis stroke="hsl(var(--foreground))" label={{ value: 'Attrition Rate %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="attritionRate" fill="url(#colorDistance)" stroke={COLORS.warning} strokeWidth={2} name="Attrition Rate %" />
                  <Line type="monotone" dataKey="count" stroke={COLORS.danger} strokeWidth={3} dot={{ r: 5 }} name="Attrition Count" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Role Risk Ranking */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Job Role Attrition Ranking</CardTitle>
              <CardDescription>Top 8 highest-risk positions (minimum 5 employees per role)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={jobRoleRanking} layout="vertical" margin={{ top: 20, right: 30, left: 140, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRoleRisk" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--foreground))" />
                  <YAxis type="category" dataKey="role" stroke="hsl(var(--foreground))" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="attritionRate" fill="url(#colorRoleRisk)" radius={[0, 8, 8, 0]} name="Attrition Rate %" />
                  <Line type="monotone" dataKey="count" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 4 }} name="Attrition Count" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 5: Work Factors */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Work Environment Factors
            <Badge variant="secondary">Behavioral Insights</Badge>
          </h2>
          <p className="text-muted-foreground">Impact of travel, overtime, and education on retention</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Marital Status Impact */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Marital Status Impact</CardTitle>
              <CardDescription>Attrition rates by marital status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={maritalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, attritionRate }) => `${status}: ${attritionRate}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="attritionRate"
                  >
                    {maritalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Overtime Impact Stacked */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Overtime Analysis</CardTitle>
              <CardDescription>Distribution comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overtimeImpact} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="category" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="attrition" stackId="a" fill={COLORS.danger} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="retained" stackId="a" fill={COLORS.success} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Education Level */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Education Level Impact</CardTitle>
              <CardDescription>Attrition by education qualification</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={educationLevelData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--foreground))" />
                  <YAxis type="category" dataKey="field" stroke="hsl(var(--foreground))" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rate" fill={COLORS.gradient1} radius={[0, 8, 8, 0]} name="Attrition Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
