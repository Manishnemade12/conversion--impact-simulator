
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import os
from models.attribution_model import train_model, predict_attribution, evaluate_model
from models.data_processor import preprocess_data, load_sample_data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the sample data on startup
sample_data = load_sample_data()
model = None

@app.route('/api/train', methods=['POST'])
def train():
    """Train a new attribution model using provided data or sample data"""
    try:
        if request.json and 'data' in request.json:
            # Use provided data
            data = request.json['data']
        else:
            # Use sample data
            data = sample_data
            
        # Preprocess the data
        X, y = preprocess_data(data)
        
        # Train the model
        global model
        model, feature_importances = train_model(X, y)
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully',
            'feature_importances': feature_importances
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make predictions using the trained model"""
    try:
        if not model:
            return jsonify({
                'success': False,
                'message': 'Model not trained yet. Please train the model first.'
            }), 400
            
        # Get input parameters from request
        params = request.json
        
        # Make prediction
        prediction, contributions = predict_attribution(model, params)
        
        return jsonify({
            'success': True,
            'prediction': float(prediction),
            'feature_contributions': contributions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/evaluate', methods=['POST'])
def evaluate():
    """Evaluate model performance on test data"""
    try:
        if request.json and 'data' in request.json:
            # Use provided data
            data = request.json['data']
        else:
            # Use sample data
            data = sample_data
            
        # Preprocess the data
        X, y = preprocess_data(data)
        
        # Evaluate the model
        metrics = evaluate_model(X, y)
        
        return jsonify({
            'success': True,
            'metrics': metrics
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
