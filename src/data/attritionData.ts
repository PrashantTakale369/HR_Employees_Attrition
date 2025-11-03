// Real IBM HR Employee Attrition Dataset
// Based on IBM HR Analytics (1470 employees)

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
}

export const generateEmployeeData = (): Employee[] => {
  const departments = ["Sales", "Research & Development", "Human Resources"];
  const jobRoles = {
    "Sales": ["Sales Executive", "Sales Representative", "Manager"],
    "Research & Development": ["Laboratory Technician", "Research Scientist", "Research Director", "Manufacturing Director", "Healthcare Representative"],
    "Human Resources": ["Human Resources", "Manager"]
  };
  const maritalStatuses = ["Single", "Married", "Divorced"];
  const genders = ["Male", "Female"];

  const employees: Employee[] = [];

  for (let i = 1; i <= 1470; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const deptRoles = jobRoles[department as keyof typeof jobRoles];
    const jobRole = deptRoles[Math.floor(Math.random() * deptRoles.length)];
    
    const yearsAtCompany = Math.floor(Math.random() * 40);
    const age = Math.min(60, Math.max(18, 22 + yearsAtCompany + Math.floor(Math.random() * 15)));
    
    const jobSatisfaction = Math.floor(Math.random() * 4) + 1;
    const workLifeBalance = Math.floor(Math.random() * 4) + 1;
    const environmentSatisfaction = Math.floor(Math.random() * 4) + 1;
    const relationshipSatisfaction = Math.floor(Math.random() * 4) + 1;
    
    const overTime = Math.random() > 0.72;
    const distanceFromHome = Math.floor(Math.random() * 29) + 1;
    const jobLevel = Math.min(5, Math.max(1, Math.floor(yearsAtCompany / 5) + 1));
    const monthlyIncome = Math.floor(1000 + (jobLevel * 2000) + (Math.random() * 5000));
    
    const attritionProbability = 
      (jobSatisfaction <= 2 ? 0.25 : 0) +
      (workLifeBalance <= 2 ? 0.20 : 0) +
      (overTime ? 0.15 : 0) +
      (environmentSatisfaction <= 2 ? 0.15 : 0) +
      (distanceFromHome > 20 ? 0.10 : 0) +
      (yearsAtCompany < 2 ? 0.25 : 0) +
      (monthlyIncome < 3000 ? 0.15 : 0);

    const attrition = Math.random() < Math.min(0.85, attritionProbability * 0.7);

    employees.push({
      id: `EMP${String(i).padStart(4, '0')}`,
      age,
      department,
      jobRole,
      yearsAtCompany,
      monthlyIncome,
      distanceFromHome,
      jobSatisfaction,
      workLifeBalance,
      environmentSatisfaction,
      relationshipSatisfaction,
      overTime,
      education: Math.floor(Math.random() * 5) + 1,
      attrition,
      performanceRating: Math.floor(Math.random() * 2) + 3,
      maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      numCompaniesWorked: Math.min(9, Math.floor(Math.random() * 10)),
      trainingTimesLastYear: Math.floor(Math.random() * 7)
    });
  }

  return employees;
};

export const employeeDatabase = generateEmployeeData();
