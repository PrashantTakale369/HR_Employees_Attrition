import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { employeeDatabase, Employee } from "@/data/attritionData";
import { predictAttrition, PredictionResult } from "@/ml/attritionModel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface EmployeeSearchProps {
  initialSearchId?: string;
}

export const EmployeeSearch = ({ initialSearchId }: EmployeeSearchProps) => {
  const [employeeId, setEmployeeId] = useState(initialSearchId || "");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (initialSearchId) {
      handleSearch();
    }
  }, [initialSearchId]);

  const handleSearch = () => {
    const searchId = employeeId || initialSearchId;
    const found = employeeDatabase.find(emp => emp.id === searchId?.toUpperCase());
    if (found) {
      setEmployee(found);
      const pred = predictAttrition(found);
      setPrediction(pred);
    } else {
      setEmployee(null);
      setPrediction(null);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-success";
      case "Medium": return "text-warning";
      case "High": return "text-destructive";
      default: return "text-foreground";
    }
  };

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "destructive" => {
    switch (risk) {
      case "Low": return "secondary";
      case "Medium": return "default";
      case "High": return "destructive";
      default: return "default";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Employee Attrition Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter Employee ID (e.g., EMP0001)"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="bg-gradient-primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {employee && prediction && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Employee Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{employee.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-semibold">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-semibold">{employee.jobRole}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={employee.attrition ? "destructive" : "secondary"}>
                  {employee.attrition ? "Left" : "Active"}
                </Badge>
              </div>
            </div>

            {/* Risk Assessment */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Attrition Risk Assessment</h3>
                  <Badge variant={getRiskBadgeVariant(prediction.attritionRisk)} className="text-sm">
                    {prediction.attritionRisk} Risk
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className={`font-semibold ${getRiskColor(prediction.attritionRisk)}`}>
                      {prediction.riskScore}/100
                    </span>
                  </div>
                  <Progress value={prediction.riskScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Factors */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Top Risk Factors
                </h3>
                <div className="space-y-3">
                  {prediction.topFactors.map((factor, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{factor.factor}</span>
                        <span className="text-muted-foreground">{factor.impact.toFixed(0)}% impact</span>
                      </div>
                      <Progress value={factor.impact} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Employee Metrics */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Job Satisfaction</p>
                    <p className="text-2xl font-bold">{employee.jobSatisfaction}/4</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Work-Life Balance</p>
                    <p className="text-2xl font-bold">{employee.workLifeBalance}/4</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Years at Company</p>
                    <p className="text-2xl font-bold">{employee.yearsAtCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-2xl font-bold">${employee.monthlyIncome.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {employeeId && !employee && (
          <div className="text-center py-8 text-muted-foreground">
            No employee found with ID: {employeeId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
