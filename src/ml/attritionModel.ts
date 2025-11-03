import { Employee } from "@/data/attritionData";

export interface PredictionResult {
  attritionRisk: "Low" | "Medium" | "High";
  riskScore: number;
  topFactors: Array<{ factor: string; impact: number }>;
  recommendations: string[];
}

export const predictAttrition = (employee: Employee): PredictionResult => {
  let riskScore = 0;
  const factors: Array<{ factor: string; impact: number }> = [];

  // Job Satisfaction
  if (employee.jobSatisfaction <= 2) {
    const impact = (3 - employee.jobSatisfaction) * 15;
    riskScore += impact;
    factors.push({ factor: "Low Job Satisfaction", impact });
  }

  // Work-Life Balance
  if (employee.workLifeBalance <= 2) {
    const impact = (3 - employee.workLifeBalance) * 12;
    riskScore += impact;
    factors.push({ factor: "Poor Work-Life Balance", impact });
  }

  // Overtime
  if (employee.overTime) {
    const impact = 20;
    riskScore += impact;
    factors.push({ factor: "Frequent Overtime", impact });
  }

  // Distance from Home
  if (employee.distanceFromHome > 20) {
    const impact = 10;
    riskScore += impact;
    factors.push({ factor: "Long Commute Distance", impact });
  }

  // Years at Company
  if (employee.yearsAtCompany < 2) {
    const impact = 18;
    riskScore += impact;
    factors.push({ factor: "Low Tenure", impact });
  }

  // Environment Satisfaction
  if (employee.environmentSatisfaction <= 2) {
    const impact = 8;
    riskScore += impact;
    factors.push({ factor: "Low Environment Satisfaction", impact });
  }

  // Income vs Age
  const expectedIncome = employee.age * 400;
  if (employee.monthlyIncome < expectedIncome) {
    const impact = 12;
    riskScore += impact;
    factors.push({ factor: "Below Expected Income", impact });
  }

  // Training
  if (employee.trainingTimesLastYear === 0) {
    const impact = 7;
    riskScore += impact;
    factors.push({ factor: "No Recent Training", impact });
  }

  // Normalize risk score to 0-100
  riskScore = Math.min(riskScore, 100);

  // Determine risk level
  let attritionRisk: "Low" | "Medium" | "High";
  if (riskScore < 30) {
    attritionRisk = "Low";
  } else if (riskScore < 60) {
    attritionRisk = "Medium";
  } else {
    attritionRisk = "High";
  }

  // Sort factors by impact
  const topFactors = factors
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (topFactors.some(f => f.factor.includes("Job Satisfaction"))) {
    recommendations.push("Schedule one-on-one meetings to discuss job satisfaction and career goals");
  }
  if (topFactors.some(f => f.factor.includes("Work-Life Balance"))) {
    recommendations.push("Review workload and consider flexible working arrangements");
  }
  if (topFactors.some(f => f.factor.includes("Overtime"))) {
    recommendations.push("Reduce overtime requirements and improve team capacity");
  }
  if (topFactors.some(f => f.factor.includes("Income"))) {
    recommendations.push("Review compensation package and market benchmarks");
  }
  if (topFactors.some(f => f.factor.includes("Training"))) {
    recommendations.push("Provide professional development and training opportunities");
  }
  if (topFactors.some(f => f.factor.includes("Tenure"))) {
    recommendations.push("Implement stronger onboarding and mentorship programs");
  }

  return {
    attritionRisk,
    riskScore,
    topFactors,
    recommendations,
  };
};
