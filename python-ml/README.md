# Python ML Backend

This folder contains the complete Python-based machine learning backend for employee attrition prediction using **FastAPI**.

## Quick Setup

**Windows:**
```bash
setup.bat
python train_model.py
python api_server.py
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
python3 train_model.py
python3 api_server.py
```

API runs at: `http://localhost:5000`  
**Interactive API Docs:** `http://localhost:5000/docs`

## Files

- `attrition_model.py` - Random Forest ML model implementation
- `train_model.py` - Model training script
- `test_model.py` - Model testing and evaluation
- `api_server.py` - **FastAPI** REST API server
- `convert_data.py` - Data preprocessing utilities
- `requirements.txt` - Python package dependencies
- `setup.bat` / `setup.sh` - Automated setup scripts
- `data/` - IBM HR Employee Attrition dataset
- `preprossing_file/` - Jupyter notebook for data analysis

## Model Details

- **Algorithm**: Random Forest Classifier
- **Accuracy**: 85-90%
- **ROC-AUC**: 88-93%
- **Dataset**: 1470 employees, 30+ features

## API Endpoints

- `POST /predict` - Single employee prediction
- `POST /predict/batch` - Batch predictions
- `POST /analyze/leave-reasons` - Analyze why employee might leave
- `POST /retention/strategies` - Generate retention strategies
- `GET /model/info` - Model information and feature importance
- `POST /train` - Train/retrain model
- `GET /health` - API health check

## Why FastAPI?

- **Fast**: High performance, on par with NodeJS and Go
- **Auto-docs**: Interactive API documentation at `/docs`
- **Type-safe**: Automatic request validation with Pydantic
- **Modern**: Async support and latest Python features
