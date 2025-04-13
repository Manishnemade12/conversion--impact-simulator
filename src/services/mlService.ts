
/**
 * Service for interacting with the ML backend API
 */
import { UserInteractionData, SimulationParameters } from '@/types/attributionModel';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Train a machine learning model using the provided data
 */
export async function trainModel(data?: UserInteractionData[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
}

/**
 * Get predictions from the trained ML model
 */
export async function getPrediction(params: SimulationParameters) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting prediction:', error);
    throw error;
  }
}

/**
 * Evaluate the model performance
 */
export async function evaluateModel(data?: UserInteractionData[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error evaluating model:', error);
    throw error;
  }
}

/**
 * Check if the ML service is available
 */
export async function checkMLServiceStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      return { available: false, modelTrained: false };
    }
    
    const data = await response.json();
    return { 
      available: true, 
      modelTrained: data.model_loaded 
    };
  } catch (error) {
    console.error('Error checking ML service status:', error);
    return { available: false, modelTrained: false };
  }
}
