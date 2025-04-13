
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AttributionModelConfig } from '@/types/attributionModel';
import { DEFAULT_MODEL_CONFIG } from '@/utils/attributionModel';

interface ModelConfigurationProps {
  config: AttributionModelConfig;
  onChange: (config: AttributionModelConfig) => void;
}

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({ config, onChange }) => {
  const [weights, setWeights] = React.useState({
    marketing_channel: (config.featureWeights.marketing_channel * 100).toString(),
    product_views: (config.featureWeights.product_views * 100).toString(),
    image_quality: (config.featureWeights.image_quality * 100).toString(),
    review_count: (config.featureWeights.review_count * 100).toString(),
    time_spent_on_page: (config.featureWeights.time_spent_on_page * 100).toString(),
  });
  
  const handleModelTypeChange = (modelType: AttributionModelConfig['modelType']) => {
    onChange({ ...config, modelType });
  };
  
  const handleWeightChange = (feature: keyof typeof weights, value: string) => {
    setWeights(prev => ({ ...prev, [feature]: value }));
  };
  
  const validateAndUpdateWeights = () => {
    // Convert string values to numbers
    const numericWeights = Object.entries(weights).reduce<Record<string, number>>((acc, [key, value]) => {
      acc[key] = parseFloat(value) / 100;
      return acc;
    }, {});
    
    // Calculate sum of weights
    const sum = Object.values(numericWeights).reduce((a, b) => a + b, 0);
    
    // Normalize weights if they don't sum to 1
    if (Math.abs(sum - 1) > 0.01) {
      // Create a complete normalized weights object with all required properties
      const normalizedWeights = {
        marketing_channel: numericWeights.marketing_channel / sum,
        product_views: numericWeights.product_views / sum,
        image_quality: numericWeights.image_quality / sum,
        review_count: numericWeights.review_count / sum,
        time_spent_on_page: numericWeights.time_spent_on_page / sum
      };
      
      // Update weights state with the specific shape
      setWeights({
        marketing_channel: (normalizedWeights.marketing_channel * 100).toFixed(0),
        product_views: (normalizedWeights.product_views * 100).toFixed(0),
        image_quality: (normalizedWeights.image_quality * 100).toFixed(0),
        review_count: (normalizedWeights.review_count * 100).toFixed(0),
        time_spent_on_page: (normalizedWeights.time_spent_on_page * 100).toFixed(0)
      });
      
      // Update model config with the normalized weights
      onChange({
        ...config,
        featureWeights: normalizedWeights
      });
    } else {
      // Create a complete weights object with all required properties for the model config
      const featureWeights = {
        marketing_channel: numericWeights.marketing_channel,
        product_views: numericWeights.product_views,
        image_quality: numericWeights.image_quality,
        review_count: numericWeights.review_count,
        time_spent_on_page: numericWeights.time_spent_on_page
      };
      
      // Update model config with the weights
      onChange({
        ...config,
        featureWeights
      });
    }
  };
  
  const resetToDefault = () => {
    onChange(DEFAULT_MODEL_CONFIG);
    setWeights({
      marketing_channel: (DEFAULT_MODEL_CONFIG.featureWeights.marketing_channel * 100).toString(),
      product_views: (DEFAULT_MODEL_CONFIG.featureWeights.product_views * 100).toString(),
      image_quality: (DEFAULT_MODEL_CONFIG.featureWeights.image_quality * 100).toString(),
      review_count: (DEFAULT_MODEL_CONFIG.featureWeights.review_count * 100).toString(),
      time_spent_on_page: (DEFAULT_MODEL_CONFIG.featureWeights.time_spent_on_page * 100).toString(),
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Configuration</CardTitle>
        <CardDescription>
          Adjust the model type and feature weights to see how they affect predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model-type">Model Type</Label>
          <Select 
            value={config.modelType} 
            onValueChange={(value) => handleModelTypeChange(value as AttributionModelConfig['modelType'])}
          >
            <SelectTrigger id="model-type">
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RandomForest">Random Forest</SelectItem>
              <SelectItem value="LogisticRegression">Logistic Regression</SelectItem>
              <SelectItem value="XGBoost">XGBoost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Feature Weights (should sum to 100%)</Label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight-marketing">Marketing Channel</Label>
              <Input
                id="weight-marketing"
                type="number"
                min="0"
                max="100"
                value={weights.marketing_channel}
                onChange={(e) => handleWeightChange('marketing_channel', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-views">Product Views</Label>
              <Input
                id="weight-views"
                type="number"
                min="0"
                max="100"
                value={weights.product_views}
                onChange={(e) => handleWeightChange('product_views', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-image">Image Quality</Label>
              <Input
                id="weight-image"
                type="number"
                min="0"
                max="100"
                value={weights.image_quality}
                onChange={(e) => handleWeightChange('image_quality', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-reviews">Review Count</Label>
              <Input
                id="weight-reviews"
                type="number"
                min="0"
                max="100"
                value={weights.review_count}
                onChange={(e) => handleWeightChange('review_count', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-time">Time on Page</Label>
              <Input
                id="weight-time"
                type="number"
                min="0"
                max="100"
                value={weights.time_spent_on_page}
                onChange={(e) => handleWeightChange('time_spent_on_page', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button onClick={validateAndUpdateWeights}>Apply Weights</Button>
            <Button variant="outline" onClick={resetToDefault}>Reset to Default</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelConfiguration;
