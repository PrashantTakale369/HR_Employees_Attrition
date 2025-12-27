"""
Test the trained ML model with sample predictions
"""
from attrition_model import AttritionPredictor
import json

def main():
    print("="*60)
    print("Testing HR Attrition Prediction Model")
    print("="*60)
    print()
    
    # Load trained model
    predictor = AttritionPredictor()
    predictor.load_model('models')
    
    print("Model loaded successfully!\n")
    
    # Test Case 1: High-risk employee
    print("Test Case 1: High-Risk Employee")
    print("-" * 40)
    
    high_risk_employee = {
        'age': 28,
        'businessTravel': 'Travel_Frequently',
        'department': 'Sales',
        'distanceFromHome': 25,
        'education': 3,
        'educationField': 'Life Sciences',
        'environmentSatisfaction': 1,
        'gender': 'Female',
        'jobInvolvement': 2,
        'jobLevel': 1,
        'jobRole': 'Sales Representative',
        'jobSatisfaction': 1,
        'maritalStatus': 'Single',
        'monthlyIncome': 3500,
        'numCompaniesWorked': 4,
        'overTime': 'Yes',
        'performanceRating': 3,
        'relationshipSatisfaction': 1,
        'stockOptionLevel': 0,
        'trainingTimesLastYear': 0,
        'workLifeBalance': 1,
        'yearsAtCompany': 2,
        'yearsInCurrentRole': 1,
        'yearsSinceLastPromotion': 1,
        'yearsWithCurrManager': 1
    }
    
    result = predictor.predict(high_risk_employee)
    print(f"Prediction: {result['prediction']}")
    print(f"Risk Score: {result['risk_score']:.2f}%")
    print(f"Risk Level: {result['risk_level'].upper()}")
    print(f"\nTop 5 Contributing Factors:")
    for i, factor in enumerate(result['top_factors'][:5], 1):
        print(f"  {i}. {factor['factor']}: {factor['importance']:.4f}")
    
    # Analyze leave reasons
    print(f"\n{'='*60}")
    print("Leave Reason Analysis:")
    print("-" * 40)
    analysis = predictor.analyze_leave_reasons(high_risk_employee)
    print(f"Total Reasons Identified: {analysis['total_reasons']}")
    print(f"Preventability Score: {analysis['preventability_score']:.2f}%\n")
    
    for i, reason in enumerate(analysis['reasons'][:3], 1):
        print(f"{i}. {reason['category']} ({reason['severity'].upper()})")
        print(f"   {reason['reason']}")
        print(f"   Impact: {reason['impact']}% | Preventable: {reason['preventable']}\n")
    
    # Test Case 2: Low-risk employee
    print(f"\n{'='*60}")
    print("Test Case 2: Low-Risk Employee")
    print("-" * 40)
    
    low_risk_employee = {
        'age': 42,
        'businessTravel': 'Travel_Rarely',
        'department': 'Research & Development',
        'distanceFromHome': 5,
        'education': 4,
        'educationField': 'Life Sciences',
        'environmentSatisfaction': 4,
        'gender': 'Male',
        'jobInvolvement': 4,
        'jobLevel': 3,
        'jobRole': 'Research Scientist',
        'jobSatisfaction': 4,
        'maritalStatus': 'Married',
        'monthlyIncome': 9000,
        'numCompaniesWorked': 1,
        'overTime': 'No',
        'performanceRating': 4,
        'relationshipSatisfaction': 4,
        'stockOptionLevel': 2,
        'trainingTimesLastYear': 4,
        'workLifeBalance': 4,
        'yearsAtCompany': 12,
        'yearsInCurrentRole': 6,
        'yearsSinceLastPromotion': 2,
        'yearsWithCurrManager': 5
    }
    
    result = predictor.predict(low_risk_employee)
    print(f"Prediction: {result['prediction']}")
    print(f"Risk Score: {result['risk_score']:.2f}%")
    print(f"Risk Level: {result['risk_level'].upper()}")
    
    # Test Case 3: Batch Prediction
    print(f"\n{'='*60}")
    print("Test Case 3: Batch Prediction (2 employees)")
    print("-" * 40)
    
    employees = [high_risk_employee, low_risk_employee]
    results = predictor.predict(employees)
    
    for i, result in enumerate(results, 1):
        print(f"\nEmployee {i}:")
        print(f"  Prediction: {result['prediction']}")
        print(f"  Risk Score: {result['risk_score']:.2f}%")
        print(f"  Risk Level: {result['risk_level'].upper()}")
    
    print(f"\n{'='*60}")
    print("Testing completed successfully!")
    print("="*60)

if __name__ == '__main__':
    main()
