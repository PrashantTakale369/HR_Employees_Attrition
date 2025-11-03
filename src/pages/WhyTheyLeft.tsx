import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { employeeDatabase } from "@/data/attritionData";
import { analyzeWhyEmployeeLeft, LeaveAnalysis } from "@/ml/leaveAnalysis";

const WhyTheyLeft = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [analysis, setAnalysis] = useState<LeaveAnalysis | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const employee = employeeDatabase.find(emp => 
      emp.id.toUpperCase() === employeeId.toUpperCase() && emp.attrition
    );

    if (employee) {
      const leaveAnalysis = analyzeWhyEmployeeLeft(employee);
      setAnalysis(leaveAnalysis);
      setNotFound(false);
    } else {
      setAnalysis(null);
      setNotFound(true);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-950 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 dark:bg-green-950 border-green-200";
      default: return "";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case "major": return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "moderate": return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "minor": return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default: return null;
    }
  };

  const getReasonBadgeVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case "critical": return "destructive";
      case "major": return "destructive";
      case "moderate": return "default";
      case "minor": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-primary" />
            Why Employees Left Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep dive analysis of employee attrition reasons
          </p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Former Employee</CardTitle>
            <CardDescription>
              Enter the ID of an employee who left the company to analyze reasons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter Employee ID (e.g., EMP0001)"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>

            {notFound && (
              <Alert variant="destructive" className="mt-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Employee not found or still active. Please enter a valid ID of an employee who has left.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary Card */}
            <Card className={`border-2 ${getSeverityColor(analysis.overallSeverity)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Employee {analysis.employeeId}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {analysis.summary}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getReasonBadgeVariant(analysis.overallSeverity)} className="text-sm px-3 py-1">
                      {analysis.overallSeverity.toUpperCase()} SEVERITY
                    </Badge>
                    {analysis.preventable ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Preventable
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Partially Preventable
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Primary Reason:</strong> {analysis.primaryReason}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Detailed Reasons */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Reasons for Leaving</CardTitle>
                <CardDescription>
                  All identified factors contributing to employee departure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.reasons.map((reason, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-3xl">{reason.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-lg">{reason.reason}</h3>
                                <Badge variant={getReasonBadgeVariant(reason.severity)}>
                                  {reason.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {reason.category}
                              </p>
                              <p className="text-sm mt-2">
                                {reason.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-muted-foreground">Impact</p>
                            <p className="text-2xl font-bold">{reason.impact}%</p>
                          </div>
                        </div>

                        {/* Impact Progress */}
                        <div className="space-y-1">
                          <Progress value={reason.impact} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {analysis.reasons.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2" />
                    <p>No specific reasons identified. Employee may have left for personal reasons.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    Recommended Actions for Future Prevention
                  </CardTitle>
                  <CardDescription>
                    Steps to prevent similar attrition in the future
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1 pt-0.5">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    Export Analysis Report
                  </Button>
                  <Button variant="outline">
                    Share with Management
                  </Button>
                  <Button variant="outline">
                    Add to Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !notFound && (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
              <p className="text-muted-foreground mb-4">
                Enter an employee ID to see detailed analysis of why they left
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching for employees like: EMP0005, EMP0012, EMP0023
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WhyTheyLeft;
