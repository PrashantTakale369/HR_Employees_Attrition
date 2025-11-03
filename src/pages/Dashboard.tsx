import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, TrendingDown, TrendingUp, Briefcase } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { OverviewCharts } from "@/components/OverviewCharts";
import { EmployeeSearch } from "@/components/EmployeeSearch";
import { employeeDatabase } from "@/data/attritionData";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [initialSearch, setInitialSearch] = useState("");

  useEffect(() => {
    const searchId = searchParams.get("search");
    if (searchId) {
      setInitialSearch(searchId);
    }
  }, [searchParams]);

  const totalEmployees = employeeDatabase.length;
  const attritionCount = employeeDatabase.filter(e => e.attrition).length;
  const attritionRate = ((attritionCount / totalEmployees) * 100).toFixed(1);
  const activeEmployees = totalEmployees - attritionCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights into workforce attrition patterns
          </p>
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Employees"
            value={totalEmployees}
            icon={Users}
          />
          <MetricCard
            title="Active Employees"
            value={activeEmployees}
            icon={Briefcase}
            trend="+5.2% from last month"
            trendUp={true}
          />
          <MetricCard
            title="Attrition Count"
            value={attritionCount}
            icon={TrendingDown}
            trend="-2.1% from last month"
            trendUp={false}
          />
          <MetricCard
            title="Attrition Rate"
            value={`${attritionRate}%`}
            icon={TrendingUp}
            trend="-1.5% from last month"
            trendUp={false}
          />
        </div>

        {/* Charts */}
        <OverviewCharts />

        {/* Employee Search */}
        <EmployeeSearch key={initialSearch} initialSearchId={initialSearch} />
      </div>
    </div>
  );
};

export default Dashboard;
