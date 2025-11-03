"""
Convert TypeScript employee data to CSV for ML training
"""
import json
import pandas as pd
import sys
import os

def convert_ts_to_csv():
    """Convert attritionData.ts to CSV format"""
    
    # Read the TypeScript file
    ts_file = '../src/data/attritionData.ts'
    
    if not os.path.exists(ts_file):
        print(f"Error: {ts_file} not found!")
        sys.exit(1)
    
    print(f"Reading data from {ts_file}...")
    
    with open(ts_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the array content
    start = content.find('[')
    end = content.rfind(']') + 1
    
    if start == -1 or end == 0:
        print("Error: Could not find employee array in file!")
        sys.exit(1)
    
    json_str = content[start:end]
    
    # Fix TypeScript syntax to valid JSON
    json_str = json_str.replace("'", '"')  # Single to double quotes
    json_str = json_str.replace('overTime: true', 'overTime: "Yes"')
    json_str = json_str.replace('overTime: false', 'overTime: "No"')
    json_str = json_str.replace('attrition: true', 'attrition: "Yes"')
    json_str = json_str.replace('attrition: false', 'attrition: "No"')
    
    try:
        # Parse JSON
        data = json.loads(json_str)
        print(f"Loaded {len(data)} employee records")
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Drop ID column (not needed for training)
        if 'id' in df.columns:
            df = df.drop('id', axis=1)
        
        # Ensure correct column order for ML
        column_order = [
            'age', 'attrition', 'businessTravel', 'department', 
            'distanceFromHome', 'education', 'educationField',
            'environmentSatisfaction', 'gender', 'jobInvolvement',
            'jobLevel', 'jobRole', 'jobSatisfaction', 'maritalStatus',
            'monthlyIncome', 'numCompaniesWorked', 'overTime',
            'performanceRating', 'relationshipSatisfaction',
            'stockOptionLevel', 'trainingTimesLastYear', 'workLifeBalance',
            'yearsAtCompany', 'yearsInCurrentRole', 'yearsSinceLastPromotion',
            'yearsWithCurrManager'
        ]
        
        # Reorder columns
        available_cols = [col for col in column_order if col in df.columns]
        df = df[available_cols]
        
        # Save to CSV
        output_dir = '../data'
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = f'{output_dir}/employee_data.csv'
        df.to_csv(output_file, index=False)
        
        print(f"\n{'='*60}")
        print("Data conversion successful!")
        print(f"{'='*60}")
        print(f"Output file: {output_file}")
        print(f"Total rows: {len(df)}")
        print(f"Total columns: {len(df.columns)}")
        print(f"\nColumn names:")
        for col in df.columns:
            print(f"  - {col}")
        
        print(f"\nAttrition distribution:")
        print(df['attrition'].value_counts())
        
        print(f"\n{'='*60}")
        print("You can now train the model using:")
        print("  python train_model.py")
        print(f"{'='*60}")
        
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print("There might be syntax issues in the TypeScript file.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    convert_ts_to_csv()
