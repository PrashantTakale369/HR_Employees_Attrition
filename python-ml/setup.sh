#!/bin/bash

# HR Insights Python ML Setup Script

echo "========================================"
echo "HR Insights - Python ML Setup"
echo "========================================"
echo ""

# Check Python version
echo "Checking Python installation..."
if ! command -v python &> /dev/null; then
    if ! command -v python3 &> /dev/null; then
        echo "Error: Python is not installed!"
        echo "Please install Python 3.8 or higher"
        exit 1
    else
        PYTHON_CMD=python3
    fi
else
    PYTHON_CMD=python
fi

echo "Python found: $($PYTHON_CMD --version)"
echo ""

# Check pip
echo "Checking pip installation..."
if ! $PYTHON_CMD -m pip --version &> /dev/null; then
    echo "Error: pip is not installed!"
    exit 1
fi

echo "pip found: $($PYTHON_CMD -m pip --version)"
echo ""

# Install dependencies
echo "Installing Python dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Convert data
echo "Converting employee data to CSV..."
$PYTHON_CMD convert_data.py

if [ $? -ne 0 ]; then
    echo "Error: Failed to convert data"
    exit 1
fi

echo ""
echo "✅ Data converted successfully!"
echo ""

# Train model
echo "Training ML model..."
echo "This may take a few minutes..."
$PYTHON_CMD train_model.py

if [ $? -ne 0 ]; then
    echo "Error: Failed to train model"
    exit 1
fi

echo ""
echo "✅ Model trained successfully!"
echo ""

# Test model
echo "Testing model..."
$PYTHON_CMD test_model.py

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "You can now start the API server:"
echo "  $PYTHON_CMD api_server.py"
echo ""
echo "Or run with hot reload:"
echo "  FLASK_DEBUG=1 $PYTHON_CMD api_server.py"
echo ""
echo "API will be available at:"
echo "  http://localhost:5000"
echo ""
echo "========================================"
