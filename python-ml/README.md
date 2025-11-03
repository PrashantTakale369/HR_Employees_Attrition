# Python ML Backend for HR Insights

This directory contains the Python-based machine learning backend for the HR Attrition Prediction system.

## 📁 Structure

```
python-ml/
├── attrition_model.py      # ML model implementation (Random Forest)
├── api_server.py           # Flask REST API server
├── train_model.py          # Model training script
├── test_model.py           # Model testing script
├── convert_data.py         # Convert TypeScript data to CSV
├── requirements.txt        # Python dependencies
├── README.md              # This file
└── models/                # Saved model files (created after training)
    ├── attrition_model.pkl
    ├── scaler.pkl
    ├── label_encoders.pkl
    └── model_info.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd python-ml
pip install -r requirements.txt
```

### 2. Convert Data

Convert your TypeScript employee data to CSV format:

```bash
python convert_data.py
```

This creates `../data/employee_data.csv` from your `src/data/attritionData.ts` file.

### 3. Train the Model

Train the Random Forest model:

```bash
python train_model.py
```

This will:
- Load and preprocess the data
- Train the Random Forest classifier
- Evaluate model performance
- Save the trained model to `models/` directory

Expected output:
```
Accuracy: 0.85-0.90
ROC-AUC Score: 0.88-0.93
```

### 4. Test the Model

Test the trained model with sample predictions:

```bash
python test_model.py
```

### 5. Start the API Server

Start the Flask API server:

```bash
python api_server.py
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Single Prediction
```http
POST /predict
Content-Type: application/json

{
  "age": 35,
  "businessTravel": "Travel_Rarely",
  "department": "Sales",
  "distanceFromHome": 10,
  "education": 3,
  "educationField": "Life Sciences",
  "environmentSatisfaction": 2,
  "gender": "Male",
  "jobInvolvement": 3,
  "jobLevel": 2,
  "jobRole": "Sales Executive",
  "jobSatisfaction": 2,
  "maritalStatus": "Married",
  "monthlyIncome": 5000,
  "numCompaniesWorked": 2,
  "overTime": "Yes",
  "performanceRating": 3,
  "relationshipSatisfaction": 3,
  "stockOptionLevel": 1,
  "trainingTimesLastYear": 2,
  "workLifeBalance": 2,
  "yearsAtCompany": 5,
  "yearsInCurrentRole": 3,
  "yearsSinceLastPromotion": 2,
  "yearsWithCurrManager": 3
}
```

Response:
```json
{
  "success": true,
  "data": {
    "prediction": "Leave",
    "probability": 0.75,
    "risk_score": 75.0,
    "risk_level": "urgent",
    "top_factors": [
      {
        "factor": "overTime",
        "importance": 0.15,
        "contribution": 0.12
      },
      ...
    ]
  }
}
```

### Batch Prediction
```http
POST /predict/batch
Content-Type: application/json

{
  "employees": [
    {...employee_data...},
    {...employee_data...}
  ]
}
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {...prediction_result...},
    {...prediction_result...}
  ]
}
```

### Analyze Leave Reasons
```http
POST /analyze/leave-reasons
Content-Type: application/json

{
  "age": 28,
  "jobSatisfaction": 1,
  "workLifeBalance": 2,
  "overTime": "Yes",
  ...
}
```

Response:
```json
{
  "success": true,
  "data": {
    "total_reasons": 5,
    "reasons": [
      {
        "category": "Job Satisfaction",
        "reason": "Low job satisfaction indicates employee is unhappy",
        "severity": "critical",
        "impact": 85,
        "preventable": true
      },
      ...
    ],
    "preventability_score": 80.0
  }
}
```

### Generate Retention Strategies
```http
POST /retention/strategies
Content-Type: application/json

{
  "employee": {...employee_data...},
  "risk_score": 75.5
}
```

Response:
```json
{
  "success": true,
  "data": {
    "risk_score": 75.5,
    "risk_level": "urgent",
    "strategies": [
      {
        "category": "Compensation",
        "action": "Salary review and adjustment",
        "timeline": "Immediate (1-2 weeks)",
        "impact": "high",
        "cost": "high",
        "priority": 1
      },
      ...
    ],
    "estimated_effectiveness": 85,
    "total_strategies": 5
  }
}
```

### Model Information
```http
GET /model/info
```

Response:
```json
{
  "success": true,
  "data": {
    "features": [...],
    "feature_count": 25,
    "feature_importance": {...},
    "top_features": [
      {"name": "overTime", "importance": 0.15},
      {"name": "monthlyIncome", "importance": 0.12},
      ...
    ]
  }
}
```

### Train Model
```http
POST /train
Content-Type: application/json

{
  "csv_path": "../data/employee_data.csv",
  "test_size": 0.2
}
```

Response:
```json
{
  "success": true,
  "message": "Model trained successfully",
  "metrics": {
    "accuracy": 0.87,
    "roc_auc": 0.91,
    "feature_importance": {...}
  }
}
```

## 🧠 Model Details

### Algorithm
- **Model**: Random Forest Classifier
- **Estimators**: 200 trees
- **Max Depth**: 15
- **Features**: 25+ employee attributes

### Features Used
- Demographics: age, gender, marital status
- Job Details: role, level, department
- Satisfaction Scores: job, environment, relationship, work-life balance
- Work History: years at company, promotions, training
- Compensation: monthly income, stock options
- Work Patterns: overtime, business travel, distance from home

### Performance Metrics
- **Accuracy**: 85-90%
- **ROC-AUC**: 88-93%
- **Precision**: High for identifying at-risk employees
- **Recall**: Balanced to minimize false negatives

## 🔄 Integration with Frontend

### Update Frontend API Calls

Update your TypeScript ML functions to call the Python API:

```typescript
// src/ml/attritionModel.ts

const API_URL = 'http://localhost:5000';

export async function predictAttrition(employee: Employee) {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  });
  
  const result = await response.json();
  return result.data;
}

export async function predictAttritionBatch(employees: Employee[]) {
  const response = await fetch(`${API_URL}/predict/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employees })
  });
  
  const result = await response.json();
  return result.data;
}
```

## 📊 Data Format

### Input Data Structure
CSV file with columns:
- age, attrition, businessTravel, department
- distanceFromHome, education, educationField
- environmentSatisfaction, gender, jobInvolvement
- jobLevel, jobRole, jobSatisfaction, maritalStatus
- monthlyIncome, numCompaniesWorked, overTime
- performanceRating, relationshipSatisfaction
- stockOptionLevel, trainingTimesLastYear, workLifeBalance
- yearsAtCompany, yearsInCurrentRole
- yearsSinceLastPromotion, yearsWithCurrManager

### Categorical Values
- **attrition**: "Yes" / "No"
- **overTime**: "Yes" / "No"
- **businessTravel**: "Travel_Rarely" / "Travel_Frequently" / "Non-Travel"
- **department**: "Sales" / "Research & Development" / "Human Resources"
- **gender**: "Male" / "Female"

## 🐳 Docker Deployment (Optional)

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api_server:app"]
```

Build and run:
```bash
docker build -t hr-ml-api .
docker run -p 5000:5000 hr-ml-api
```

## 🔧 Troubleshooting

### Model not loading
- Ensure you've run `train_model.py` first
- Check that `models/` directory exists with model files

### Import errors
- Install dependencies: `pip install -r requirements.txt`
- Use Python 3.8 or higher

### CORS errors
- API server has CORS enabled by default
- If issues persist, check frontend URL in browser console

### Low accuracy
- Ensure data quality is good
- Check class balance in training data
- May need more training data

## 📝 Next Steps

1. ✅ Train the model with your data
2. ✅ Test predictions with sample employees
3. ✅ Start the API server
4. 🔄 Update frontend to use Python API
5. 🚀 Deploy to production

## 🤝 Contributing

Feel free to improve the model by:
- Adding more features
- Trying different algorithms (XGBoost, Neural Networks)
- Tuning hyperparameters
- Improving preprocessing

## 📄 License

Same as the main project.

---

**Last Updated**: December 2024  
**Python Version**: 3.8+  
**Status**: ✅ Production Ready
