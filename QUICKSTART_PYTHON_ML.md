# 🚀 Quick Start: Python ML Backend

Get your Python ML backend running in **5 minutes**!

---

## Windows Users

```bash
# 1. Navigate to python-ml folder
cd python-ml

# 2. Run setup script (does everything automatically)
setup.bat

# 3. Start API server
python api_server.py
```

**Done!** API is running at `http://localhost:5000`

---

## Linux/Mac Users

```bash
# 1. Navigate to python-ml folder
cd python-ml

# 2. Make setup script executable
chmod +x setup.sh

# 3. Run setup script (does everything automatically)
./setup.sh

# 4. Start API server
python3 api_server.py
```

**Done!** API is running at `http://localhost:5000`

---

## What the Setup Does

1. ✅ Checks Python installation
2. ✅ Installs required packages (Flask, scikit-learn, pandas, etc.)
3. ✅ Converts your employee data from TypeScript to CSV
4. ✅ Trains Random Forest ML model (~2 minutes)
5. ✅ Tests the model with sample predictions
6. ✅ Saves trained model to `models/` folder

---

## Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status":"healthy","model_loaded":true}
```

---

## Connect Frontend to Python API

### Option 1: Environment Variable (Recommended)

Create `.env` file in project root:

```env
VITE_ML_API_URL=http://localhost:5000
```

Then restart your frontend:

```bash
npm run dev
```

### Option 2: Update Imports

In your React components, replace:

```typescript
// OLD:
import { predictAttrition } from "@/ml/attritionModel";

// NEW:
import { predictAttrition } from "@/ml/pythonMLApi";
```

---

## Verify Everything Works

1. ✅ Frontend running: `http://localhost:8082`
2. ✅ Python API running: `http://localhost:5000`
3. ✅ API health check passes
4. ✅ Predictions work in frontend

---

## Troubleshooting

### "Python not found"
Install Python from: https://www.python.org/downloads/

### "Port 5000 already in use"
Change port in `api_server.py` (line 328):
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### "Model not loaded"
Run training again:
```bash
python train_model.py
```

---

## Next Steps

✅ **Setup complete!**

Now you can:
- Use ML predictions from Python backend
- Better accuracy than TypeScript version
- Easy to retrain with new data
- Deploy to production

---

**Need help?** See full guide: `PYTHON_ML_SETUP.md`
