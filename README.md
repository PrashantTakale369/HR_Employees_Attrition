# HR Employee Attrition Predictor

## What is this?

This is a web application that helps HR teams figure out which employees might leave the company soon. 

You know how expensive it is when good people quit - recruitment costs, training new hires, lost productivity. This tool analyzes your workforce data and tells you who's at risk of leaving before it happens, so you can actually do something about it.

The app uses machine learning (Random Forest model with 85-90% accuracy) trained on real IBM HR data to spot patterns that usually lead to attrition. It doesn't just give you a "yes/no" answer - it shows you WHY someone might leave (low pay, bad work-life balance, lack of growth) and suggests specific things you can do to keep them around.

Built with React + TypeScript on the front end and Python + Flask for the ML backend.

## 🎯 Features

### 🏠 Modern Landing Page
- Beautiful gradient design with 8 interactive feature cards
- Color-coded sections for easy navigation
- Responsive layout (mobile, tablet, desktop)
- Stats showcase footer

### 📊 Analytics & Dashboards
- **Dashboard**: Key HR metrics and statistics overview
- **Analytics**: Deep workforce analytics and trends
- **Employees**: Searchable employee directory

### 🧠 ML-Powered Predictions
- **Predictions**: Individual employee attrition risk analysis
- **Batch Prediction**: Bulk employee risk assessment
- **Alerts System**: Real-time monitoring and notifications
- **Why They Left**: Detailed departure reason analysis
- **Retention Strategies**: Personalized intervention plans

### 🐍 Python ML Backend
- **Random Forest Classifier**: 85-90% accuracy
- **REST API**: Flask-based prediction service
- **Real-time Analysis**: Fast predictions via API
- **Feature Importance**: Identifies key attrition factors
- **Scalable**: Easy to retrain and improve

## 🚀 Quick Start

### Frontend Setup

```bash
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
python api_server.py
```

**Linux/Mac:**
```bash
cd python-ml
chmod +x setup.sh
./setup.sh
python3 api_server.py
```

API runs at: `http://localhost:5000`

**See detailed guide**: [`QUICKSTART_PYTHON_ML.md`](QUICKSTART_PYTHON_ML.md)

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI framework
- **shadcn-ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend (Python ML)
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **scikit-learn** - Machine learning
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **Random Forest** - ML algorithm (85-90% accuracy)

### Data
- **IBM HR Attrition Dataset** - 1470 employee records
- **30+ features** - Age, job satisfaction, income, etc.
- **CSV format** - Easy to update and retrain

## 📚 Documentation

- **[QUICKSTART_PYTHON_ML.md](QUICKSTART_PYTHON_ML.md)** - Get Python ML running in 5 minutes
- **[PYTHON_ML_SETUP.md](PYTHON_ML_SETUP.md)** - Detailed setup guide
- **[python-ml/README.md](python-ml/README.md)** - API documentation
- **[NEW_FEATURES.md](NEW_FEATURES.md)** - Advanced ML features guide
- **[HOME_PAGE_UPDATE.md](HOME_PAGE_UPDATE.md)** - Landing page documentation

## 🐍 Python ML Features

### Prediction API
- **Single Prediction**: Analyze one employee
- **Batch Prediction**: Process multiple employees
- **Risk Scoring**: 0-100% attrition probability
- **Factor Analysis**: Top 10 contributing factors

### Leave Analysis
- **13+ Reason Categories**: Job satisfaction, compensation, work-life balance, etc.
- **Severity Assessment**: Critical, major, moderate, minor
- **Impact Scoring**: Percentage impact of each factor
- **Preventability**: Identifies controllable vs uncontrollable factors

### Retention Strategies
- **Automated Plans**: Generate personalized retention strategies
- **7 Intervention Types**: Compensation, career development, work-life balance, etc.
- **Timeline Estimates**: Immediate, short-term, medium-term
- **Cost-Impact Analysis**: High/medium/low impact and cost ratings

<img width="1920" height="1080" alt="Screenshot (451)" src="https://github.com/user-attachments/assets/631cb4df-0816-4017-804f-21a188aef06e" />
<img width="1920" height="1080" alt="Screenshot (452)" src="https://github.com/user-attachments/assets/da6a2e80-29ab-4f17-ae70-c03f39adbcc3" />
<img width="1920" height="1080" alt="Screenshot (454)" src="https://github.com/user-attachments/assets/5a77162c-d967-4549-963d-e6334d4a8c01" />
<img width="1920" height="1080" alt="Screenshot (455)" src="https://github.com/user-attachments/assets/1b0586bc-02de-4672-9104-2588b8c17732" />
<img width="1920" height="1080" alt="Screenshot (456)" src="https://github.com/user-attachments/assets/8984edbd-e265-403f-8081-3a37597eb57a" />
<img width="1920" heigh<img width="1920" height="1080" alt="Screenshot (458)" src="https://github.com/user-attachments/assets/99d2d1b0-f883-4156-90d0-c88b71e18159" />
<img width="1920" height="1080" alt="Screenshot (458)" src="https://github.com/user-attachments/assets/25d3c20e-c747-46a6-a58b-a5cdf0cbea02" />
<img width="1920" height="1080" alt="Screenshot (459)" src="https://github.com/user-attachments/assets/950e9735-74d1-44b5-b871-14841b028a0c" />


## 🎓 Getting Started

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Setup Frontend**
   ```bash
   npm install
   npm run dev
   ```

3. **Setup Python ML** (See [QUICKSTART_PYTHON_ML.md](QUICKSTART_PYTHON_ML.md))
   ```bash
   cd python-ml
   setup.bat  # Windows
   # or
   ./setup.sh # Linux/Mac
   python api_server.py
   ```

4. **Open in browser**
   - Frontend: http://localhost:8082
   - API: http://localhost:5000

## ✨ Key Improvements

✅ **Python ML Backend** - Professional ML with 85-90% accuracy  
✅ **Modern Landing Page** - Beautiful home with all features  
✅ **Advanced Analytics** - 8 comprehensive feature pages  
✅ **Real-time Predictions** - Fast API-based predictions  
✅ **Retention Tools** - Actionable strategies and alerts  
✅ **Responsive Design** - Works on all devices  
✅ **Type-safe** - Full TypeScript support  

## 📈 Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | 85-90% |
| ROC-AUC | 88-93% |
| Training Time | ~2 minutes |
| Prediction Time | <100ms |

## 🤝 Contributing

Feel free to contribute by:
- Improving ML model accuracy
- Adding new features
- Fixing bugs
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.
