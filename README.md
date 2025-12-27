# HR Employee Attrition Predictor

## What is this?

This is an end-to-end machine learning system that helps HR teams predict which employees might leave the company soon. 

You know how expensive it is when good people quit - recruitment costs, training new hires, lost productivity. This tool analyzes your workforce data and tells you who's at risk of leaving before it happens, so you can actually do something about it.

The app uses a Random Forest machine learning model (85-90% accuracy) trained on real IBM HR data to spot patterns that usually lead to attrition. It doesn't just give you a "yes/no" answer - it shows you WHY someone might leave (low pay, bad work-life balance, lack of growth) and suggests specific things you can do to keep them around.

Built with React + TypeScript on the front end and Python + **FastAPI** + scikit-learn for the ML backend.

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

**Linux/Mac:**
```bash
cd python-ml
chmod +x setup.sh
./setup.sh
python3 train_model.py
python3 api_server.py
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
