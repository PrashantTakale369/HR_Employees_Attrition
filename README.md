# HR Employee Attrition Predictor

## What is this?

This is an end-to-end machine learning system that helps HR teams predict which employees might leave the company soon. 

You know how expensive it is when good people quit - recruitment costs, training new hires, lost productivity. This tool analyzes your workforce data and tells you who's at risk of leaving before it happens, so you can actually do something about it.

The app uses a Random Forest machine learning model (85-90% accuracy) trained on real IBM HR data to spot patterns that usually lead to attrition. It doesn't just give you a "yes/no" answer - it shows you WHY someone might leave (low pay, bad work-life balance, lack of growth) and suggests specific things you can do to keep them around.


## 🤖 Why Machine Learning?

Traditional HR methods rely on exit interviews and surveys after employees leave - by then it's too late. This project uses **machine learning** to be proactive instead of reactive.

**The Problem:**
- Employee turnover costs companies 6-9 months of an employee's salary
- Exit interviews only tell you why people left, not who will leave next
- Manual analysis of 30+ employee factors is time-consuming and prone to bias

**The ML Solution:**
- Analyzes 30+ employee attributes simultaneously (age, satisfaction, income, work-life balance, etc.)
- Identifies complex patterns humans might miss
- Predicts attrition risk with 85-90% accuracy
- Provides actionable insights for retention strategies

## 📊 The Model: Random Forest Classifier

**Why Random Forest?**

We use a **Random Forest Classifier** with 200 decision trees because:

1. **High Accuracy** - Consistently achieves 85-90% accuracy on employee attrition
2. **Handles Mixed Data** - Works well with both numerical (salary, age) and categorical (department, job role) features
3. **Feature Importance** - Shows which factors matter most (monthly income, overtime, work-life balance)
4. **Robust** - Less prone to overfitting than single decision trees
5. **No Feature Scaling Required** - Works directly with raw employee data
6. **Interpretable** - Can explain why a specific employee is at risk

**Actual Model Configuration :- in my code  **
```python
RandomForestClassifier(
    n_estimators=200,        # 200 decision trees
    max_depth=15,            # Maximum tree depth
    min_samples_split=10,    # Min samples to split a node
    min_samples_leaf=4,      # Min samples in leaf node
    random_state=42,
    n_jobs=-1                # Use all CPU cores
)
```

**Dataset:**
- **1,470 employee records** (IBM HR Attrition Dataset)
- **25 features** including: age, businessTravel, department, distanceFromHome, education, educationField, environmentSatisfaction, gender, jobInvolvement, jobLevel, jobRole, jobSatisfaction, maritalStatus, monthlyIncome, numCompaniesWorked, overTime, performanceRating, relationshipSatisfaction, stockOptionLevel, trainingTimesLastYear, workLifeBalance, yearsAtCompany, yearsInCurrentRole, yearsSinceLastPromotion, yearsWithCurrManager

## 🚀 Quick Start

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/PrashantTakale369/HR_Employees_Attrition.git
cd HR_Employees_Attrition

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:8082`

### Python ML Backend Setup

**Windows:**
```bash
cd python-ml
setup.bat
python train_model.py
python api_server.py
```


API runs at: `http://localhost:5000`  
**Interactive API Docs:** `http://localhost:5000/docs`

## 🎯 Key Features

- **Dashboard** - Key HR metrics and statistics overview
- **Analytics** - Deep workforce analytics and trends  
- **Employee Directory** - Searchable employee database
- **Predictions** - Individual employee attrition risk analysis
- **Batch Prediction** - Bulk employee risk assessment
- **Alerts System** - Real-time monitoring and notifications
- **Why They Left** - Detailed departure reason analysis
- **Retention Strategies** - Personalized intervention plans

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **shadcn-ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend (ML)
- **Python 3.8+** - Programming language
- **FastAPI** - Modern, fast REST API framework
- **Pydantic** - Data validation and settings
- **Uvicorn** - ASGI server
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **Random Forest** - ML algorithm (85-90% accuracy)

### Data
- **IBM HR Attrition Dataset** - 1470 employee records
- **30+ features** - Age, job satisfaction, income, etc.
- **CSV format** - Easy to update and retrain

## 🔌 API Features

- **Auto-generated docs** - Interactive Swagger UI at `/docs`
- **Type validation** - Automatic request/response validation with Pydantic
- **High performance** - FastAPI is one of the fastest Python frameworks
- **Modern standards** - OpenAPI & JSON Schema support
- **Easy testing** - Built-in API testing interface

## 📈 Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | 85-90% |
| ROC-AUC | 88-93% |
| Training Time | ~2 minutes |
| Prediction Time | <100ms |

## 📸 Screenshots

<img width="1920" height="1080" alt="Dashboard Overview" src="https://github.com/user-attachments/assets/631cb4df-0816-4017-804f-21a188aef06e" />
<img width="1920" height="1080" alt="Analytics" src="https://github.com/user-attachments/assets/da6a2e80-29ab-4f17-ae70-c03f39adbcc3" />
<img width="1920" height="1080" alt="Employee Directory" src="https://github.com/user-attachments/assets/5a77162c-d967-4549-963d-e6334d4a8c01" />
<img width="1920" height="1080" alt="Predictions" src="https://github.com/user-attachments/assets/1b0586bc-02de-4672-9104-2588b8c17732" />
<img width="1920" height="1080" alt="Batch Analysis" src="https://github.com/user-attachments/assets/8984edbd-e265-403f-8081-3a37597eb57a" />
<img width="1920" height="1080" alt="Alerts System" src="https://github.com/user-attachments/assets/99d2d1b0-f883-4156-90d0-c88b71e18159" />
<img width="1920" height="1080" alt="Why They Left" src="https://github.com/user-attachments/assets/25d3c20e-c747-46a6-a58b-a5cdf0cbea02" />
<img width="1920" height="1080" alt="Retention Strategies" src="https://github.com/user-attachments/assets/950e9735-74d1-44b5-b871-14841b028a0c" />

## 🤝 Contributing

Feel free to contribute by:
- Adding new features
- Fixing bugs
- Improving documentation
- Enhancing UI/UX

## 📄 License

This project is open source and available under the MIT License.
