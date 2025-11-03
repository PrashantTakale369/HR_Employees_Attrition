import { Employee } from "@/data/attritionData";

export interface LeaveReason {
  category: string;
  reason: string;
  severity: "critical" | "major" | "moderate" | "minor";
  impact: number;
  description: string;
  icon: string;
}

export interface LeaveAnalysis {
  employeeId: string;
  primaryReason: string;
  reasons: LeaveReason[];
  overallSeverity: "critical" | "high" | "medium" | "low";
  preventable: boolean;
  recommendations: string[];
  summary: string;
}

export const analyzeWhyEmployeeLeft = (employee: Employee): LeaveAnalysis => {
  const reasons: LeaveReason[] = [];

  // 1. Job Satisfaction Analysis
  if (employee.jobSatisfaction <= 2) {
    reasons.push({
      category: "Job Satisfaction",
      reason: `Low Job Satisfaction (${employee.jobSatisfaction}/4)`,
      severity: employee.jobSatisfaction === 1 ? "critical" : "major",
      impact: 25,
      description: "Employee expressed significant dissatisfaction with their role and responsibilities.",
      icon: "😞"
    });
  }

  // 2. Work-Life Balance
  if (employee.workLifeBalance <= 2) {
    reasons.push({
      category: "Work-Life Balance",
      reason: `Poor Work-Life Balance (${employee.workLifeBalance}/4)`,
      severity: employee.workLifeBalance === 1 ? "critical" : "major",
      impact: 20,
      description: "Employee struggled to maintain healthy work-life balance, leading to burnout.",
      icon: "⚖️"
    });
  }

  // 3. Overtime
  if (employee.overTime) {
    reasons.push({
      category: "Workload",
      reason: "Excessive Overtime Required",
      severity: "major",
      impact: 18,
      description: "Consistently required to work overtime, contributing to stress and dissatisfaction.",
      icon: "⏰"
    });
  }

  // 4. Environment Satisfaction
  if (employee.environmentSatisfaction <= 2) {
    reasons.push({
      category: "Work Environment",
      reason: `Unsatisfactory Work Environment (${employee.environmentSatisfaction}/4)`,
      severity: "moderate",
      impact: 15,
      description: "Issues with workplace culture, tools, or physical environment.",
      icon: "🏢"
    });
  }

  // 5. Compensation
  const avgIncome = 6500; // average in dataset
  if (employee.monthlyIncome < avgIncome * 0.8) {
    const percentBelow = ((avgIncome - employee.monthlyIncome) / avgIncome * 100).toFixed(0);
    reasons.push({
      category: "Compensation",
      reason: `Below Market Salary (${percentBelow}% below average)`,
      severity: "major",
      impact: 22,
      description: `Monthly income of $${employee.monthlyIncome.toLocaleString()} is significantly below market average.`,
      icon: "💰"
    });
  }

  // 6. Career Growth - based on years at company without much progress
  if (employee.yearsAtCompany >= 8 && employee.monthlyIncome < avgIncome) {
    reasons.push({
      category: "Career Growth",
      reason: `Stagnant Career (${employee.yearsAtCompany} years with low progression)`,
      severity: "major",
      impact: 20,
      description: "Long tenure without corresponding career advancement or salary growth.",
      icon: "📈"
    });
  }

  // 7. Distance from Home
  if (employee.distanceFromHome > 20) {
    reasons.push({
      category: "Commute",
      reason: `Long Commute (${employee.distanceFromHome} km)`,
      severity: "moderate",
      impact: 12,
      description: "Lengthy daily commute impacting quality of life and work-life balance.",
      icon: "🚗"
    });
  }

  // 8. Experience & Multiple Companies
  if (employee.numCompaniesWorked >= 5) {
    reasons.push({
      category: "Career Progression",
      reason: `High Job Mobility (${employee.numCompaniesWorked} previous employers)`,
      severity: "moderate",
      impact: 12,
      description: "Pattern of frequent job changes may indicate ongoing career exploration.",
      icon: "🎯"
    });
  }

  // 9. Relationship Satisfaction
  if (employee.relationshipSatisfaction <= 2) {
    reasons.push({
      category: "Workplace Relationships",
      reason: `Poor Workplace Relationships (${employee.relationshipSatisfaction}/4)`,
      severity: "moderate",
      impact: 14,
      description: "Difficulty with team dynamics or manager relationships.",
      icon: "👥"
    });
  }

  // 10. Training Opportunities
  if (employee.trainingTimesLastYear === 0) {
    reasons.push({
      category: "Professional Development",
      reason: "No Training Opportunities",
      severity: "moderate",
      impact: 13,
      description: "Lack of professional development and skill enhancement opportunities.",
      icon: "📚"
    });
  }

  // 11. Low Performance
  if (employee.performanceRating <= 2) {
    reasons.push({
      category: "Performance",
      reason: `Low Performance Rating (${employee.performanceRating}/4)`,
      severity: "moderate",
      impact: 15,
      description: "Performance concerns may indicate job-role mismatch or lack of support.",
      icon: "🔌"
    });
  }

  // 12. Marital Status & Life Changes
  if (employee.maritalStatus === "Divorced" && employee.distanceFromHome > 15) {
    reasons.push({
      category: "Personal Circumstances",
      reason: "Life Changes Affecting Work",
      severity: "moderate",
      impact: 10,
      description: "Personal life changes may have necessitated career transition.",
      icon: "�"
    });
  }

  // 13. Education Level & Role Mismatch
  if (employee.education >= 4 && employee.monthlyIncome < avgIncome * 0.9) {
    reasons.push({
      category: "Education Mismatch",
      reason: "Overqualified for Position",
      severity: "moderate",
      impact: 14,
      description: "High education level not reflected in compensation or role.",
      icon: "🎓"
    });
  }

  // 15. Young Age + Low Tenure
  if (employee.age < 25 && employee.yearsAtCompany < 2) {
    reasons.push({
      category: "Early Career Exploration",
      reason: "Early Career Stage",
      severity: "minor",
      impact: 10,
      description: "Young professional exploring career options and opportunities.",
      icon: "🌱"
    });
  }

  // Sort by impact
  reasons.sort((a, b) => b.impact - a.impact);

  // Determine primary reason
  const primaryReason = reasons.length > 0 
    ? reasons[0].reason 
    : "Multiple contributing factors";

  // Calculate overall severity
  const criticalCount = reasons.filter(r => r.severity === "critical").length;
  const majorCount = reasons.filter(r => r.severity === "major").length;
  
  let overallSeverity: "critical" | "high" | "medium" | "low";
  if (criticalCount >= 2 || (criticalCount >= 1 && majorCount >= 2)) {
    overallSeverity = "critical";
  } else if (majorCount >= 2 || criticalCount >= 1) {
    overallSeverity = "high";
  } else if (reasons.length >= 3) {
    overallSeverity = "medium";
  } else {
    overallSeverity = "low";
  }

  // Determine if preventable
  const preventableCategories = ["Job Satisfaction", "Work-Life Balance", "Compensation", "Career Growth", "Work Environment"];
  const preventable = reasons.some(r => preventableCategories.includes(r.category));

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (reasons.some(r => r.category === "Compensation")) {
    recommendations.push("Review and adjust compensation to market standards");
  }
  if (reasons.some(r => r.category === "Career Growth")) {
    recommendations.push("Implement clear career progression pathways and regular promotion reviews");
  }
  if (reasons.some(r => r.category === "Work-Life Balance" || r.category === "Workload")) {
    recommendations.push("Reduce overtime requirements and improve work-life balance policies");
  }
  if (reasons.some(r => r.category === "Job Satisfaction")) {
    recommendations.push("Conduct role satisfaction surveys and adjust responsibilities");
  }
  if (reasons.some(r => r.category === "Work Environment")) {
    recommendations.push("Improve workplace culture and environment based on employee feedback");
  }
  if (reasons.some(r => r.category === "Professional Development")) {
    recommendations.push("Increase training opportunities and professional development programs");
  }

  // Generate summary
  const topThreeReasons = reasons.slice(0, 3).map(r => r.category).join(", ");
  const summary = reasons.length > 0
    ? `Employee left primarily due to ${topThreeReasons}. ${preventable ? "This was preventable with proper intervention." : "Some factors were beyond organizational control."}`
    : "Insufficient data to determine specific reasons.";

  return {
    employeeId: employee.id,
    primaryReason,
    reasons: reasons.slice(0, 10), // Return top 10 reasons
    overallSeverity,
    preventable,
    recommendations,
    summary
  };
};
