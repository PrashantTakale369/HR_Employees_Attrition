from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from attrition_model import AttritionPredictor
import pandas as pd
import json
import os
import uvicorn

app = FastAPI(title="HR Attrition Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model
predictor = AttritionPredictor()

# Try to load existing model, otherwise train new one
MODEL_DIR = 'models'
if os.path.exists(f'{MODEL_DIR}/attrition_model.pkl'):
    print("Loading existing model...")
    predictor.load_model(MODEL_DIR)
else:
    print("No existing model found. Please train the model first.")

# Pydantic models for request validation
class BatchPredictRequest(BaseModel):
    employees: List[Dict[str, Any]]

class TrainRequest(BaseModel):
    csv_path: str = '../data/employee_data.csv'
    test_size: float = 0.2

class RetentionRequest(BaseModel):
    employee: Dict[str, Any]
    risk_score: float = 0

@app.get('/health')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'model_loaded': predictor.model is not None
    }

@app.post('/predict')
def predict_attrition(employee_data: Dict[str, Any]):
    """
    Predict attrition for a single employee
    """
    try:
        if not employee_data:
            raise HTTPException(status_code=400, detail='No data provided')
        
        if predictor.model is None:
            raise HTTPException(status_code=500, detail='Model not loaded')
        
        result = predictor.predict(employee_data)
        
        return {
            'success': True,
            'data': result
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/predict/batch')
def predict_batch(request: BatchPredictRequest):
    """
    Predict attrition for multiple employees
    """
    try:
        employees = request.employees
        
        if not employees:
            raise HTTPException(status_code=400, detail='No employee data provided')
        
        if predictor.model is None:
            raise HTTPException(status_code=500, detail='Model not loaded')
        
        results = predictor.predict(employees)
        
        return {
            'success': True,
            'count': len(employees),
            'data': results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/analyze/leave-reasons')
def analyze_leave_reasons(employee_data: Dict[str, Any]):
    """
    Analyze why an employee might leave
    """
    try:
        if not employee_data:
            raise HTTPException(status_code=400, detail='No data provided')
        
        analysis = predictor.analyze_leave_reasons(employee_data)
        
        return {
            'success': True,
            'data': analysis
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/model/info')
def model_info():
    """Get model information and feature importance"""
    try:
        if predictor.model is None:
            raise HTTPException(status_code=500, detail='Model not loaded')
        
        sorted_features = sorted(
            predictor.feature_importance.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return {
            'success': True,
            'data': {
                'features': predictor.feature_names,
                'feature_count': len(predictor.feature_names),
                'feature_importance': dict(sorted_features),
                'top_features': [
                    {'name': feat, 'importance': imp}
                    for feat, imp in sorted_features[:10]
                ]
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/train')
def train_model(request: TrainRequest):
    """
    Train or retrain the model
    """
    try:
        csv_path = request.csv_path
        test_size = request.test_size
        
        if not os.path.exists(csv_path):
            raise HTTPException(status_code=404, detail=f'Data file not found: {csv_path}')
        
        results = predictor.train(csv_path, test_size=test_size)
        predictor.save_model(MODEL_DIR)
        
        return {
            'success': True,
            'message': 'Model trained successfully',
            'metrics': results
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/retention/strategies')
def generate_retention_strategies(request: RetentionRequest):
    """
    Generate retention strategies for an employee
    """
    try:
        employee = request.employee
        risk_score = request.risk_score
        
        if not employee:
            raise HTTPException(status_code=400, detail='No employee data provided')
        
        strategies = []
        
        # Compensation Strategy
        if employee.get('monthlyIncome', 0) < 5000:
            strategies.append({
                'category': 'Compensation',
                'action': 'Salary review and adjustment (+10-15% market rate comparison)',
                'timeline': 'Immediate (1-2 weeks)',
                'impact': 'high',
                'cost': 'high',
                'priority': 1
            })
        
        # Work-Life Balance
        if employee.get('overTime') == 'Yes' or employee.get('workLifeBalance', 3) <= 2:
            strategies.append({
                'category': 'Work-Life Balance',
                'action': 'Reduce overtime, implement flexible schedule, remote work options',
                'timeline': 'Short-term (2-4 weeks)',
                'impact': 'high',
                'cost': 'low',
                'priority': 1
            })
        
        # Career Development
        if employee.get('trainingTimesLastYear', 1) == 0 or employee.get('yearsAtCompany', 0) >= 5:
            strategies.append({
                'category': 'Career Development',
                'action': 'Create personalized development plan, assign mentor, discuss promotion path',
                'timeline': 'Medium-term (1-3 months)',
                'impact': 'high',
                'cost': 'medium',
                'priority': 2
            })
        
        # Job Satisfaction
        if employee.get('jobSatisfaction', 3) <= 2:
            strategies.append({
                'category': 'Job Redesign',
                'action': 'One-on-one discussion, role adjustment, task variety increase',
                'timeline': 'Short-term (2-4 weeks)',
                'impact': 'high',
                'cost': 'low',
                'priority': 1
            })
        
        # Recognition
        if employee.get('performanceRating', 3) >= 3:
            strategies.append({
                'category': 'Recognition & Rewards',
                'action': 'Employee recognition program, spot bonuses, public acknowledgment',
                'timeline': 'Immediate (1 week)',
                'impact': 'medium',
                'cost': 'low',
                'priority': 2
            })
        
        strategies.sort(key=lambda x: (x['priority'], x['impact'] == 'high'), reverse=True)
        
        high_impact = sum(1 for s in strategies if s['impact'] == 'high')
        effectiveness = min(high_impact * 25 + len(strategies) * 10, 95)
        
        return {
            'success': True,
            'data': {
                'risk_score': risk_score,
                'risk_level': predictor._get_risk_level(risk_score),
                'strategies': strategies[:5],
                'estimated_effectiveness': effectiveness,
                'total_strategies': len(strategies)
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    print("="*60)
    print("HR Attrition Prediction API Server (FastAPI)")
    print("="*60)
    print("\nAvailable Endpoints:")
    print("  GET  /health                      - Health check")
    print("  POST /predict                     - Single prediction")
    print("  POST /predict/batch               - Batch predictions")
    print("  POST /analyze/leave-reasons       - Analyze leave reasons")
    print("  POST /retention/strategies        - Generate retention strategies")
    print("  GET  /model/info                  - Model information")
    print("  POST /train                       - Train/retrain model")
    print("\nStarting server on http://localhost:5000")
    print("API Documentation: http://localhost:5000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=5000)
