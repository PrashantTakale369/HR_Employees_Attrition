// Real IBM HR Employee Attrition Dataset
// Source: IBM HR Analytics Employee Attrition & Performance
// Total Employees: 1470

export interface Employee {
  id: string;
  age: number;
  department: string;
  jobRole: string;
  yearsAtCompany: number;
  monthlyIncome: number;
  distanceFromHome: number;
  jobSatisfaction: number;
  workLifeBalance: number;
  environmentSatisfaction: number;
  relationshipSatisfaction: number;
  overTime: boolean;
  education: number;
  attrition: boolean;
  performanceRating: number;
  maritalStatus: string;
  gender: string;
  numCompaniesWorked: number;
  trainingTimesLastYear: number;
  // Additional fields from IBM dataset
  businessTravel: string;
  educationField: string;
  jobInvolvement: number;
  jobLevel: number;
  stockOptionLevel: number;
  totalWorkingYears: number;
  yearsInCurrentRole: number;
  yearsSinceLastPromotion: number;
  yearsWithCurrManager: number;
}

// This will be populated from the CSV file
// For now, we'll load it asynchronously
let employeeData: Employee[] = [];

export const loadRealEmployeeData = async (): Promise<Employee[]> => {
  if (employeeData.length > 0) {
    return employeeData;
  }

  try {
    // Fetch the CSV file from python-ml/data directory
    const response = await fetch('/python-ml/data/IBM_HR_Employee_Attrition.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    employeeData = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',');
        
        return {
          id: `EMP${String(index + 1).padStart(4, '0')}`,
          age: parseInt(values[0]) || 0,
          attrition: values[1] === 'Yes',
          businessTravel: values[2] || 'Travel_Rarely',
          department: values[4] || 'Unknown',
          distanceFromHome: parseInt(values[5]) || 0,
          education: parseInt(values[6]) || 1,
          educationField: values[7] || 'Unknown',
          environmentSatisfaction: parseInt(values[10]) || 1,
          gender: values[11] || 'Male',
          jobInvolvement: parseInt(values[13]) || 1,
          jobLevel: parseInt(values[14]) || 1,
          jobRole: values[15] || 'Unknown',
          jobSatisfaction: parseInt(values[16]) || 1,
          maritalStatus: values[17] || 'Single',
          monthlyIncome: parseInt(values[18]) || 0,
          numCompaniesWorked: parseInt(values[20]) || 0,
          overTime: values[22] === 'Yes',
          performanceRating: parseInt(values[24]) || 3,
          relationshipSatisfaction: parseInt(values[25]) || 1,
          stockOptionLevel: parseInt(values[27]) || 0,
          totalWorkingYears: parseInt(values[28]) || 0,
          trainingTimesLastYear: parseInt(values[29]) || 0,
          workLifeBalance: parseInt(values[30]) || 1,
          yearsAtCompany: parseInt(values[31]) || 0,
          yearsInCurrentRole: parseInt(values[32]) || 0,
          yearsSinceLastPromotion: parseInt(values[33]) || 0,
          yearsWithCurrManager: parseInt(values[34]) || 0
        };
      });
    
    return employeeData;
  } catch (error) {
    console.error('Error loading IBM dataset:', error);
    // Fallback to dummy data if CSV fails to load
    return generateFallbackData();
  }
};

// Synchronous access (use after loading)
export const getRealEmployeeDatabase = (): Employee[] => {
  return employeeData;
};

// Fallback data generator in case CSV loading fails
const generateFallbackData = (): Employee[] => {
  console.warn('Using fallback employee data');
  return [];
};

// Initialize on module load
export const initializeEmployeeData = async () => {
  await loadRealEmployeeData();
  console.log(`✅ Loaded ${employeeData.length} real employees from IBM dataset`);
};
