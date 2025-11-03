from flask import Flask, request, jsonify
from flask_cors import CORS
from attrition_model import AttritionPredictor
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)
# Initialize model
predictor = AttritionPredictor()

# Try to load existing model, otherwise train new one
MODEL_DIR = 'models'
if os.path.exists(f'{MODEL_DIR}/attrition_model.pkl'):
    print("Loading existing model...")
    predictor.load_model(MODEL_DIR)
else:
    print("No existing model found. Please train the model first.")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.model is not None
    })

@app.route('/predict', methods=['POST'])
def predict_attrition():
    """
    Predict attrition for a single employee
    
    Request body:
    {
        "age": 35,
        "businessTravel": "Travel_Rarely",
        "department": "Sales",
        ...
    }
    """
    try:
        employee_data = request.json
        
        if not employee_data:
            return jsonify({'error': 'No data provided'}), 400
        
        if predictor.model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make prediction
        result = predictor.predict(employee_data)
        
        return jsonify({
            'success': True,
            'data': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Predict attrition for multiple employees
    
    Request body:
    {
        "employees": [
            {...employee_data...},
            {...employee_data...}
        ]
    }
    """
    try:
        data = request.json
        employees = data.get('employees', [])
        
        if not employees:
            return jsonify({'error': 'No employee data provided'}), 400
        
        if predictor.model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make predictions
        results = predictor.predict(employees)
        
        return jsonify({
            'success': True,
            'count': len(employees),
            'data': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/analyze/leave-reasons', methods=['POST'])
def analyze_leave_reasons():
    """
    Analyze why an employee might leave
    
    Request body:
    {
        "age": 35,
        "jobSatisfaction": 1,
        "workLifeBalance": 2,
        ...
    }
    """
    try:
        employee_data = request.json
        
        if not employee_data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Analyze reasons
        analysis = predictor.analyze_leave_reasons(employee_data)
        
        return jsonify({
            'success': True,
            'data': analysis
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information and feature importance"""
    try:
        if predictor.model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Sort features by importance
        sorted_features = sorted(
            predictor.feature_importance.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return jsonify({
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
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    """
    Train or retrain the model
    
    Request body:
    {
        "csv_path": "path/to/data.csv",
        "test_size": 0.2
    }
    """
    try:
        data = request.json
        csv_path = data.get('csv_path', '../data/employee_data.csv')
        test_size = data.get('test_size', 0.2)
        
        if not os.path.exists(csv_path):
            return jsonify({'error': f'Data file not found: {csv_path}'}), 404
        
        # Train model
        results = predictor.train(csv_path, test_size=test_size)
        
        # Save model
        predictor.save_model(MODEL_DIR)
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'metrics': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/retention/strategies', methods=['POST'])
def generate_retention_strategies():
    """
    Generate retention strategies for an employee
    
    Request body:
    {
        "employee": {...employee_data...},
        "risk_score": 75.5
    }
    """
    try:
        data = request.json
        employee = data.get('employee', {})
        risk_score = data.get('risk_score', 0)
        
        if not employee:
            return jsonify({'error': 'No employee data provided'}), 400
        
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
        
        # Sort by priority and impact
        strategies.sort(key=lambda x: (x['priority'], x['impact'] == 'high'), reverse=True)
        
        # Calculate effectiveness
        high_impact = sum(1 for s in strategies if s['impact'] == 'high')
        effectiveness = min(high_impact * 25 + len(strategies) * 10, 95)
        
        return jsonify({
            'success': True,
            'data': {
                'risk_score': risk_score,
                'risk_level': predictor._get_risk_level(risk_score),
                'strategies': strategies[:5],  # Top 5 strategies
                'estimated_effectiveness': effectiveness,
                'total_strategies': len(strategies)
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("="*60)
    print("HR Attrition Prediction API Server")
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
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
