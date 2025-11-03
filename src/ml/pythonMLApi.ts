// API Integration for Python ML Backend
// Replace the existing ML functions with these API calls

const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

export interface Employee {
  age: number;
  businessTravel: string;
  department: string;
  distanceFromHome: number;
  education: number;
  educationField: string;
  environmentSatisfaction: number;
  gender: string;
  jobInvolvement: number;
  jobLevel: number;
  jobRole: string;
  jobSatisfaction: number;
  maritalStatus: string;
  monthlyIncome: number;
  numCompaniesWorked: number;
  overTime: string | boolean;
  performanceRating: number;
  relationshipSatisfaction: number;
  stockOptionLevel: number;
  trainingTimesLastYear: number;
  workLifeBalance: number;
  yearsAtCompany: number;
  yearsInCurrentRole: number;
  yearsSinceLastPromotion: number;
  yearsWithCurrManager: number;
}

export interface PredictionResult {
  prediction: string;
  probability: number;
  risk_score: number;
  risk_level: string;
  top_factors: Array<{
    factor: string;
    importance: number;
    contribution: number;
  }>;
}

export interface LeaveAnalysis {
  total_reasons: number;
  reasons: Array<{
    category: string;
    reason: string;
    severity: string;
    impact: number;
    preventable: boolean;
  }>;
  preventability_score: number;
}

export interface RetentionStrategy {
  category: string;
  action: string;
  timeline: string;
  impact: string;
  cost: string;
  priority: number;
}

export interface RetentionPlan {
  risk_score: number;
  risk_level: string;
  strategies: RetentionStrategy[];
  estimated_effectiveness: number;
  total_strategies: number;
}

// Normalize employee data (convert boolean overTime to string)
function normalizeEmployee(employee: Employee): Employee {
  return {
    ...employee,
    overTime: typeof employee.overTime === 'boolean' 
      ? (employee.overTime ? 'Yes' : 'No') 
      : employee.overTime
  };
}

/**
 * Check if ML API is available
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy' && data.model_loaded;
  } catch (error) {
    console.error('ML API health check failed:', error);
    return false;
  }
}

/**
 * Predict attrition for a single employee
 */
export async function predictAttrition(employee: Employee): Promise<PredictionResult> {
  try {
    const normalized = normalizeEmployee(employee);
    
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalized),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Prediction failed');
    }

    return result.data;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

/**
 * Predict attrition for multiple employees (batch)
 */
export async function predictAttritionBatch(employees: Employee[]): Promise<PredictionResult[]> {
  try {
    const normalized = employees.map(normalizeEmployee);
    
    const response = await fetch(`${API_BASE_URL}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employees: normalized }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Batch prediction failed');
    }

    return result.data;
  } catch (error) {
    console.error('Batch prediction error:', error);
    throw error;
  }
}

/**
 * Analyze why an employee might leave
 */
export async function analyzeLeaveReasons(employee: Employee): Promise<LeaveAnalysis> {
  try {
    const normalized = normalizeEmployee(employee);
    
    const response = await fetch(`${API_BASE_URL}/analyze/leave-reasons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalized),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Leave analysis failed');
    }

    return result.data;
  } catch (error) {
    console.error('Leave analysis error:', error);
    throw error;
  }
}

/**
 * Generate retention strategies for an employee
 */
export async function generateRetentionStrategies(
  employee: Employee,
  riskScore: number
): Promise<RetentionPlan> {
  try {
    const normalized = normalizeEmployee(employee);
    
    const response = await fetch(`${API_BASE_URL}/retention/strategies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employee: normalized,
        risk_score: riskScore,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Strategy generation failed');
    }

    return result.data;
  } catch (error) {
    console.error('Strategy generation error:', error);
    throw error;
  }
}

/**
 * Get model information and feature importance
 */
export async function getModelInfo(): Promise<{
  features: string[];
  feature_count: number;
  feature_importance: Record<string, number>;
  top_features: Array<{ name: string; importance: number }>;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/model/info`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get model info');
    }

    return result.data;
  } catch (error) {
    console.error('Model info error:', error);
    throw error;
  }
}

// Export backward-compatible function that maps to new API
export { predictAttrition as default };
