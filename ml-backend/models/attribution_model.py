
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
import joblib
import os

def train_model(X, y, model_type='RandomForest'):
    """
    Train a machine learning model for attribution modeling
    
    Parameters:
        X: Features array
        y: Target array
        model_type: Type of model to train (RandomForest or LogisticRegression)
        
    Returns:
        model: Trained model
        feature_importances: Dictionary mapping feature names to importance scores
    """
    # Select model based on type
    if model_type == 'LogisticRegression':
        model = LogisticRegression(max_iter=1000, class_weight='balanced')
    else:  # Default to RandomForest
        model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    
    # Train the model
    model.fit(X, y)
    
    # Get feature importance
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    else:
        importances = np.abs(model.coef_[0])
    
    # Map importances to feature names
    feature_names = X.columns if hasattr(X, 'columns') else [f'feature_{i}' for i in range(X.shape[1])]
    feature_importances = dict(zip(feature_names, importances))
    
    # Save the model
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'saved_models')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, 'attribution_model.pkl'))
    
    return model, feature_importances

def predict_attribution(model, input_data):
    """
    Make prediction using the trained model
    
    Parameters:
        model: Trained model
        input_data: Dictionary of input features
        
    Returns:
        prediction: Conversion probability
        contributions: Feature contributions to the prediction
    """
    # Format input data
    from .data_processor import format_input_for_prediction
    X = format_input_for_prediction(input_data)
    
    # Predict probability of conversion
    prediction = model.predict_proba(X)[0, 1]
    
    # Calculate feature contributions (simplified SHAP approximation)
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    else:
        importances = np.abs(model.coef_[0])
        
    # Normalize features
    normalized_features = X / np.sum(X)
    
    # Calculate weighted contribution
    weighted_features = normalized_features * importances
    total_contribution = np.sum(weighted_features)
    
    # Map to feature names
    feature_names = X.columns if hasattr(X, 'columns') else [f'feature_{i}' for i in range(X.shape[1])]
    contributions = {}
    for i, name in enumerate(feature_names):
        contributions[name] = float(weighted_features[0, i] / total_contribution) if total_contribution > 0 else 0
    
    return prediction, contributions

def evaluate_model(X, y):
    """
    Evaluate model performance
    
    Parameters:
        X: Features array
        y: Target array
        
    Returns:
        metrics: Dictionary of performance metrics
    """
    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model, _ = train_model(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    # Calculate metrics
    metrics = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred)),
        'recall': float(recall_score(y_test, y_pred)),
        'f1': float(f1_score(y_test, y_pred)),
        'auc': float(roc_auc_score(y_test, y_prob))
    }
    
    return metrics
