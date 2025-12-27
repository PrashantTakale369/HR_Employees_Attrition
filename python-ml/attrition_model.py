import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import joblib
import json
import warnings
warnings.filterwarnings('ignore')

class AttritionPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        self.feature_importance = {}
        
    def load_data(self, csv_path):
        """Load employee data from CSV"""
        df = pd.read_csv(csv_path)
        return df
    
    def preprocess_data(self, df, is_training=True):
        """Preprocess the data for modeling"""
        df_processed = df.copy()
        
        # Convert categorical variables
        categorical_cols = [
            'businessTravel', 'department', 'educationField', 
            'gender', 'jobRole', 'maritalStatus', 'overTime'
        ]
        
        for col in categorical_cols:
            if col in df_processed.columns:
                if is_training:
                    le = LabelEncoder()
                    df_processed[col] = le.fit_transform(df_processed[col].astype(str))
                    self.label_encoders[col] = le
                else:
                    if col in self.label_encoders:
                        df_processed[col] = self.label_encoders[col].transform(df_processed[col].astype(str))
        
        # Convert attrition to binary if present
        if 'attrition' in df_processed.columns:
            df_processed['attrition'] = df_processed['attrition'].map({'Yes': 1, 'No': 0})
        
        return df_processed
    
    def prepare_features(self, df):
        """Prepare feature matrix and target variable"""
        # Define feature columns
        feature_cols = [
            'age', 'businessTravel', 'department', 'distanceFromHome',
            'education', 'educationField', 'environmentSatisfaction',
            'gender', 'jobInvolvement', 'jobLevel', 'jobRole',
            'jobSatisfaction', 'maritalStatus', 'monthlyIncome',
            'numCompaniesWorked', 'overTime', 'performanceRating',
            'relationshipSatisfaction', 'stockOptionLevel',
            'trainingTimesLastYear', 'workLifeBalance', 'yearsAtCompany',
            'yearsInCurrentRole', 'yearsSinceLastPromotion', 'yearsWithCurrManager'
        ]
        
        # Filter available columns
        available_cols = [col for col in feature_cols if col in df.columns]
        self.feature_names = available_cols
        
        X = df[available_cols]
        y = df['attrition'] if 'attrition' in df.columns else None
        
        return X, y
    
    def train(self, csv_path, test_size=0.2, random_state=42):
        """Train the attrition prediction model"""
        print("Loading data...")
        df = self.load_data(csv_path)
        
        print("Preprocessing data...")
        df_processed = self.preprocess_data(df, is_training=True)
        
        print("Preparing features...")
        X, y = self.prepare_features(df_processed)
        
        print(f"Training with {len(X)} samples and {len(X.columns)} features")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Random Forest model
        print("Training Random Forest model...")
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=10,
            min_samples_leaf=4,
            random_state=random_state,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
        
        accuracy = accuracy_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        
        print(f"\n{'='*50}")
        print(f"Model Performance:")
        print(f"{'='*50}")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"ROC-AUC Score: {roc_auc:.4f}")
        print(f"\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['Stay', 'Leave']))
        
        # Feature importance
        self.feature_importance = dict(zip(
            self.feature_names,
            self.model.feature_importances_
        ))
        
        print(f"\nTop 10 Important Features:")
        sorted_features = sorted(self.feature_importance.items(), key=lambda x: x[1], reverse=True)[:10]
        for feat, imp in sorted_features:
            print(f"  {feat}: {imp:.4f}")
        
        return {
            'accuracy': float(accuracy),
            'roc_auc': float(roc_auc),
            'feature_importance': self.feature_importance
        }
    
    def predict(self, employee_data):
        """Predict attrition probability for a single employee or batch"""
        if isinstance(employee_data, dict):
            df = pd.DataFrame([employee_data])
        else:
            df = pd.DataFrame(employee_data)
        
        # Preprocess
        df_processed = self.preprocess_data(df, is_training=False)
        X, _ = self.prepare_features(df_processed)
        
        # Scale
        X_scaled = self.scaler.transform(X)
        
        # Predict
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)[:, 1]
        
        results = []
        for idx, (pred, prob) in enumerate(zip(predictions, probabilities)):
            risk_score = float(prob * 100)
            
            # Get top contributing factors
            feature_contributions = []
            for feat_name, feat_value in zip(self.feature_names, X_scaled[idx]):
                contribution = float(feat_value * self.feature_importance.get(feat_name, 0))
                feature_contributions.append({
                    'factor': feat_name,
                    'importance': float(self.feature_importance.get(feat_name, 0)),
                    'contribution': contribution
                })
            
            # Sort by contribution
            feature_contributions.sort(key=lambda x: abs(x['contribution']), reverse=True)
            
            results.append({
                'prediction': 'Leave' if pred == 1 else 'Stay',
                'probability': float(prob),
                'risk_score': risk_score,
                'risk_level': self._get_risk_level(risk_score),
                'top_factors': feature_contributions[:10]
            })
        
        return results if len(results) > 1 else results[0]
    
    def _get_risk_level(self, risk_score):
        """Determine risk level based on score"""
        if risk_score >= 75:
            return 'urgent'
        elif risk_score >= 60:
            return 'high'
        elif risk_score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def analyze_leave_reasons(self, employee_data):
        """Analyze why an employee might leave"""
        if isinstance(employee_data, dict):
            df = pd.DataFrame([employee_data])
        else:
            df = employee_data
        
        reasons = []
        
        # Job Satisfaction
        if 'jobSatisfaction' in df.columns and df['jobSatisfaction'].iloc[0] <= 2:
            severity = 'critical' if df['jobSatisfaction'].iloc[0] == 1 else 'major'
            reasons.append({
                'category': 'Job Satisfaction',
                'reason': 'Low job satisfaction indicates employee is unhappy with their role',
                'severity': severity,
                'impact': 85,
                'preventable': True
            })
        
        # Work-Life Balance
        if 'workLifeBalance' in df.columns and df['workLifeBalance'].iloc[0] <= 2:
            reasons.append({
                'category': 'Work-Life Balance',
                'reason': 'Poor work-life balance causing stress and burnout',
                'severity': 'critical',
                'impact': 80,
                'preventable': True
            })
        
        # Overtime
        if 'overTime' in df.columns and df['overTime'].iloc[0] in ['Yes', 1, True]:
            reasons.append({
                'category': 'Overtime',
                'reason': 'Frequent overtime leading to exhaustion',
                'severity': 'major',
                'impact': 70,
                'preventable': True
            })
        
        # Compensation
        if 'monthlyIncome' in df.columns:
            avg_income = 6500  # Industry average
            if df['monthlyIncome'].iloc[0] < avg_income * 0.8:
                reasons.append({
                    'category': 'Compensation',
                    'reason': 'Below-market compensation',
                    'severity': 'critical',
                    'impact': 90,
                    'preventable': True
                })
        
        # Career Growth
        if 'yearsSinceLastPromotion' in df.columns and df['yearsSinceLastPromotion'].iloc[0] >= 5:
            reasons.append({
                'category': 'Career Growth',
                'reason': 'No career advancement in 5+ years',
                'severity': 'major',
                'impact': 75,
                'preventable': True
            })
        
        # Commute
        if 'distanceFromHome' in df.columns and df['distanceFromHome'].iloc[0] > 20:
            reasons.append({
                'category': 'Commute',
                'reason': 'Long commute distance causing daily stress',
                'severity': 'moderate',
                'impact': 50,
                'preventable': False
            })
        
        # Environment
        if 'environmentSatisfaction' in df.columns and df['environmentSatisfaction'].iloc[0] <= 2:
            reasons.append({
                'category': 'Work Environment',
                'reason': 'Poor workplace environment satisfaction',
                'severity': 'major',
                'impact': 65,
                'preventable': True
            })
        
        # Relationships
        if 'relationshipSatisfaction' in df.columns and df['relationshipSatisfaction'].iloc[0] <= 2:
            reasons.append({
                'category': 'Relationships',
                'reason': 'Poor workplace relationships',
                'severity': 'moderate',
                'impact': 60,
                'preventable': True
            })
        
        # Training
        if 'trainingTimesLastYear' in df.columns and df['trainingTimesLastYear'].iloc[0] == 0:
            reasons.append({
                'category': 'Professional Development',
                'reason': 'No training or skill development opportunities',
                'severity': 'moderate',
                'impact': 55,
                'preventable': True
            })
        
        # Sort by impact
        reasons.sort(key=lambda x: x['impact'], reverse=True)
        
        return {
            'total_reasons': len(reasons),
            'reasons': reasons,
            'preventability_score': sum(1 for r in reasons if r['preventable']) / max(len(reasons), 1) * 100
        }
    
    def save_model(self, model_dir='models'):
        """Save trained model and preprocessors"""
        import os
        os.makedirs(model_dir, exist_ok=True)
        
        joblib.dump(self.model, f'{model_dir}/attrition_model.pkl')
        joblib.dump(self.scaler, f'{model_dir}/scaler.pkl')
        joblib.dump(self.label_encoders, f'{model_dir}/label_encoders.pkl')
        
        # Save feature info
        with open(f'{model_dir}/model_info.json', 'w') as f:
            json.dump({
                'feature_names': self.feature_names,
                'feature_importance': self.feature_importance
            }, f, indent=2)
        
        print(f"Model saved to {model_dir}/")
    
    def load_model(self, model_dir='models'):
        """Load trained model and preprocessors"""
        self.model = joblib.load(f'{model_dir}/attrition_model.pkl')
        self.scaler = joblib.load(f'{model_dir}/scaler.pkl')
        self.label_encoders = joblib.load(f'{model_dir}/label_encoders.pkl')
        
        # Load feature info
        with open(f'{model_dir}/model_info.json', 'r') as f:
            info = json.load(f)
            self.feature_names = info['feature_names']
            self.feature_importance = info['feature_importance']
        
        print(f"Model loaded from {model_dir}/")


if __name__ == '__main__':
    # Example usage
    predictor = AttritionPredictor()
    
    # Train model
    print("Training model...")
    results = predictor.train('../data/employee_data.csv')
    
    # Save model
    predictor.save_model()
    
    # Test prediction
    print("\n" + "="*50)
    print("Testing prediction...")
    print("="*50)
    
    test_employee = {
        'age': 35,
        'businessTravel': 'Travel_Rarely',
        'department': 'Sales',
        'distanceFromHome': 10,
        'education': 3,
        'educationField': 'Life Sciences',
        'environmentSatisfaction': 2,
        'gender': 'Male',
        'jobInvolvement': 3,
        'jobLevel': 2,
        'jobRole': 'Sales Executive',
        'jobSatisfaction': 2,
        'maritalStatus': 'Married',
        'monthlyIncome': 5000,
        'numCompaniesWorked': 2,
        'overTime': 'Yes',
        'performanceRating': 3,
        'relationshipSatisfaction': 3,
        'stockOptionLevel': 1,
        'trainingTimesLastYear': 2,
        'workLifeBalance': 2,
        'yearsAtCompany': 5,
        'yearsInCurrentRole': 3,
        'yearsSinceLastPromotion': 2,
        'yearsWithCurrManager': 3
    }
    
    prediction = predictor.predict(test_employee)
    print(f"\nPrediction: {prediction['prediction']}")
    print(f"Risk Score: {prediction['risk_score']:.2f}%")
    print(f"Risk Level: {prediction['risk_level']}")
    
    print("\nTop Contributing Factors:")
    for factor in prediction['top_factors'][:5]:
        print(f"  - {factor['factor']}: {factor['importance']:.4f}")
    
    # Analyze leave reasons
    print("\n" + "="*50)
    print("Analyzing leave reasons...")
    print("="*50)
    
    analysis = predictor.analyze_leave_reasons(test_employee)
    print(f"\nTotal Reasons Identified: {analysis['total_reasons']}")
    print(f"Preventability Score: {analysis['preventability_score']:.2f}%")
    
    print("\nTop Reasons:")
    for reason in analysis['reasons'][:5]:
        print(f"\n  Category: {reason['category']}")
        print(f"  Reason: {reason['reason']}")
        print(f"  Severity: {reason['severity']}")
        print(f"  Impact: {reason['impact']}%")
        print(f"  Preventable: {reason['preventable']}")
