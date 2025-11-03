import { useState } from "react";
import { employeeDatabase } from "@/data/attritionData";
import { FilterPanel, FilterState } from "@/components/FilterPanel";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { OverviewCharts } from "@/components/OverviewCharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const Analytics = () => {
  const [filters, setFilters] = useState<FilterState>({
    department: "all",
    ageRange: [20, 65],
    tenure: "all",
    satisfaction: "all",
  });

  const filteredEmployees = employeeDatabase.filter((emp) => {
    if (filters.department !== "all" && emp.department !== filters.department) return false;
    if (emp.age < filters.ageRange[0] || emp.age > filters.ageRange[1]) return false;
    
    if (filters.tenure !== "all") {
      const years = emp.yearsAtCompany;
      if (filters.tenure === "0-2" && (years < 0 || years > 2)) return false;
      if (filters.tenure === "3-5" && (years < 3 || years > 5)) return false;
      if (filters.tenure === "6-10" && (years < 6 || years > 10)) return false;
      if (filters.tenure === "11+" && years < 11) return false;
    }
    
    if (filters.satisfaction !== "all" && emp.jobSatisfaction !== parseInt(filters.satisfaction)) return false;
    
    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ["ID", "Department", "Age", "Role", "Attrition", "Satisfaction", "Years"].join(","),
      ...filteredEmployees.map(emp =>
        [emp.id, emp.department, emp.age, emp.jobRole, emp.attrition, emp.jobSatisfaction, emp.yearsAtCompany].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attrition-analysis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Report exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Deep dive into attrition patterns with {filteredEmployees.length} employees
            </p>
          </div>
          <Button onClick={handleExport} className="bg-gradient-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <AdvancedCharts employees={filteredEmployees} />
            <OverviewCharts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
