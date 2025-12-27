"""
Train the ML model using employee data
"""
from attrition_model import AttritionPredictor
import sys
import os

def main():
    # Check if data file exists
    data_path = '../data/employee_data.csv'
    
    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        print("Please ensure you have the employee_data.csv file in the data/ directory")
        sys.exit(1)
    
    print("="*60)
    print("HR Attrition Prediction Model Training")
    print("="*60)
    print()
    
    # Initialize predictor
    predictor = AttritionPredictor()
    
    # Train model
    try:
        results = predictor.train(data_path)
        
        print("\n" + "="*60)
        print("Training completed successfully!")
        print("="*60)
        
        # Save model
        predictor.save_model('models')
        
        print("\nModel files saved to 'models/' directory:")
        print("  - attrition_model.pkl")
        print("  - scaler.pkl")
        print("  - label_encoders.pkl")
        print("  - model_info.json")
        
        print("\nYou can now start the API server using:")
        print("  python api_server.py")
        
    except Exception as e:
        print(f"\nError during training: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
