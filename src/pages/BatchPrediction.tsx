import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, AlertTriangle, CheckCircle2, Users, FileSpreadsheet } from "lucide-react";
import { employeeDatabase, Employee } from "@/data/attritionData";
import { predictAttrition } from "@/ml/attritionModel";
import { toast } from "sonner";

interface BatchResult {
  employee: Employee;
  riskScore: number;
  riskLevel: string;
  topFactors: Array<{ factor: string; impact: number }>;
}

const BatchPrediction = () => {
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File "${file.name}" selected`);
    }
  };

  const processBatchPrediction = () => {
    setIsProcessing(true);
    
    // Simulate processing - in real app, parse CSV
    setTimeout(() => {
      const batchResults: BatchResult[] = employeeDatabase.slice(0, 20).map(emp => {
        const prediction = predictAttrition(emp);
        return {
          employee: emp,
          riskScore: prediction.riskScore,
          riskLevel: prediction.attritionRisk,
          topFactors: prediction.topFactors.slice(0, 3)
        };
      });

      // Sort by risk score descending
      batchResults.sort((a, b) => b.riskScore - a.riskScore);
      
      setResults(batchResults);
      setIsProcessing(false);
      toast.success(`Processed ${batchResults.length} employees`);
    }, 2000);
  };

  const exportResults = () => {
    const csvContent = [
      ['Employee ID', 'Department', 'Role', 'Risk Score', 'Risk Level', 'Top Risk Factor', 'Factor Impact'].join(','),
      ...results.map(r => [
        r.employee.id,
        r.employee.department,
        r.employee.jobRole,
        r.riskScore,
        r.riskLevel,
        r.topFactors[0]?.factor || 'N/A',
        r.topFactors[0]?.impact.toFixed(1) + '%' || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attrition-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Results exported successfully');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600 dark:text-red-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "Low": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600";
    }
  };

  const getRiskBadge = (level: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (level) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "outline";
    }
  };

  const highRiskCount = results.filter(r => r.riskLevel === "High").length;
  const mediumRiskCount = results.filter(r => r.riskLevel === "Medium").length;
  const lowRiskCount = results.filter(r => r.riskLevel === "Low").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
            Batch Prediction Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload employee data or analyze existing employees in bulk
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Employee Data</CardTitle>
            <CardDescription>
              Upload a CSV file with employee data or analyze all current employees
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
              <Button
                onClick={processBatchPrediction}
                disabled={isProcessing}
                className="min-w-[150px]"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze All
                  </>
                )}
              </Button>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                CSV format: Include columns for Age, Department, JobRole, MonthlyIncome, YearsAtCompany, etc.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        {results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Analyzed</p>
                    <p className="text-2xl font-bold">{results.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">{mediumRiskCount}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold text-green-600">{lowRiskCount}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>
                    Employees sorted by attrition risk (highest first)
                  </CardDescription>
                </div>
                <Button onClick={exportResults} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={result.employee.id} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-12 items-center">
                        {/* Employee Info */}
                        <div className="md:col-span-3">
                          <p className="font-semibold">{result.employee.id}</p>
                          <p className="text-sm text-muted-foreground">{result.employee.jobRole}</p>
                          <p className="text-xs text-muted-foreground">{result.employee.department}</p>
                        </div>

                        {/* Risk Score */}
                        <div className="md:col-span-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Risk Score</span>
                              <Badge variant={getRiskBadge(result.riskLevel)}>
                                {result.riskLevel}
                              </Badge>
                            </div>
                            <Progress value={result.riskScore} className="h-2" />
                            <p className={`text-sm font-semibold ${getRiskColor(result.riskLevel)}`}>
                              {result.riskScore}%
                            </p>
                          </div>
                        </div>

                        {/* Top Risk Factor */}
                        <div className="md:col-span-4">
                          <p className="text-xs text-muted-foreground mb-1">Top Risk Factor</p>
                          <div className="space-y-1">
                            {result.topFactors.slice(0, 2).map((factor, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm font-medium truncate">{factor.factor}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {factor.impact.toFixed(0)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="md:col-span-2 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/dashboard?search=${result.employee.id}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {results.length === 0 && !isProcessing && (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload a CSV file or click "Analyze All" to process existing employees
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BatchPrediction;
