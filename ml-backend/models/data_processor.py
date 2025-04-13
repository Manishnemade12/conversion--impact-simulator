
import pandas as pd
import numpy as np
import json
import os

def load_sample_data():
    """Load sample data for attribution modeling"""
    # First, check if we have a sample data file
    sample_data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'sample_data.json')
    
    if os.path.exists(sample_data_path):
        with open(sample_data_path, 'r') as f:
            return json.load(f)
    
    # Otherwise, generate synthetic data
    n_samples = 500
    data = []
    
    # Marketing channels
    channels = ['Ad', 'Email', 'Influencer']
    channel_probs = [0.5, 0.3, 0.2]
    
    for i in range(n_samples):
        # Generate random features
        channel = np.random.choice(channels, p=channel_probs)
        product_views = max(1, int(np.random.normal(4, 2)))
        image_quality = max(1, min(5, int(np.random.normal(3.5, 0.8))))
        review_count = max(0, int(np.random.normal(25, 15)))
        time_spent = max(10, min(300, int(np.random.normal(120, 60))))
        
        # Conversion probability depends on features
        p_conversion = 0.2  # Base probability
        
        # Channel effects
        if channel == 'Ad':
            p_conversion += 0.1
        elif channel == 'Email':
            p_conversion += 0.15
        elif channel == 'Influencer':
            p_conversion += 0.25
        
        # Other feature effects
        p_conversion += (image_quality - 3) * 0.05
        p_conversion += (review_count / 100) * 0.1
        p_conversion += (time_spent / 300) * 0.1
        p_conversion += (product_views / 10) * 0.1
        
        # Limit probability between 0.05 and 0.95
        p_conversion = max(0.05, min(0.95, p_conversion))
        
        # Generate conversion outcome
        conversion = 1 if np.random.random() < p_conversion else 0
        
        # Add to cart is more likely if the user eventually converts
        add_to_cart = 1 if (conversion == 1 and np.random.random() < 0.8) or np.random.random() < 0.3 else 0
        
        # Add data point
        data.append({
            'user_id': f'user_{i}',
            'marketing_channel': channel,
            'product_views': product_views,
            'add_to_cart': add_to_cart,
            'image_quality': image_quality,
            'review_count': review_count,
            'time_spent_on_page': time_spent,
            'conversion': conversion
        })
    
    # Save sample data
    os.makedirs(os.path.dirname(sample_data_path), exist_ok=True)
    with open(sample_data_path, 'w') as f:
        json.dump(data, f)
    
    return data

def preprocess_data(data):
    """
    Preprocess data for model training
    
    Parameters:
        data: List of dictionaries containing user interaction data
        
    Returns:
        X: Features DataFrame
        y: Target array
    """
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Encode categorical variables
    channel_dummies = pd.get_dummies(df['marketing_channel'], prefix='channel')
    df = pd.concat([df, channel_dummies], axis=1)
    
    # Select features
    features = [
        'product_views', 'image_quality', 'review_count', 
        'time_spent_on_page', 'add_to_cart'
    ]
    
    # Add encoded categorical features
    for col in channel_dummies.columns:
        features.append(col)
    
    # Create feature matrix and target
    X = df[features]
    y = df['conversion']
    
    return X, y

def format_input_for_prediction(input_data):
    """Format input data for model prediction"""
    # Create a dictionary for the input
    formatted_input = {}
    
    # Copy numeric features
    numeric_features = [
        'product_views', 'image_quality', 'review_count', 
        'time_spent_on_page', 'add_to_cart'
    ]
    
    for feature in numeric_features:
        if feature in input_data:
            formatted_input[feature] = input_data[feature]
        else:
            # Default values if not provided
            if feature == 'add_to_cart':
                formatted_input[feature] = 0
            else:
                formatted_input[feature] = 3  # Neutral default
    
    # One-hot encode marketing channel
    channel = input_data.get('marketing_channel', 'Ad')
    channels = ['Ad', 'Email', 'Influencer']
    for ch in channels:
        formatted_input[f'channel_{ch}'] = 1 if channel == ch else 0
    
    # Convert to DataFrame for scikit-learn
    df = pd.DataFrame([formatted_input])
    
    return df
