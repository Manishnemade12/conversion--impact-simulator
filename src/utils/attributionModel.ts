
import { UserInteractionData, SimulationParameters, AttributionModelConfig } from '@/types/attributionModel';

// Default model configuration
export const DEFAULT_MODEL_CONFIG: AttributionModelConfig = {
  modelType: 'RandomForest',
  featureWeights: {
    marketing_channel: 0.3,
    product_views: 0.2,
    image_quality: 0.15,
    review_count: 0.25,
    time_spent_on_page: 0.1
  }
};

// Normalize a value within its range
function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

// Channel influence factor (simplified ML stand-in)
function getChannelScore(channel: 'Ad' | 'Email' | 'Influencer'): number {
  switch (channel) {
    case 'Ad':
      return 0.7;
    case 'Email':
      return 0.6;
    case 'Influencer':
      return 0.8;
    default:
      return 0.5;
  }
}

// Predict conversion probability based on parameters
export function predictConversion(
  params: SimulationParameters, 
  modelConfig: AttributionModelConfig = DEFAULT_MODEL_CONFIG
): number {
  // Normalize feature values
  const normalizedViews = normalize(params.product_views, 1, 10);
  const normalizedImageQuality = normalize(params.image_quality, 1, 5);
  const normalizedReviews = normalize(params.review_count, 0, 100);
  const normalizedTimeSpent = normalize(params.time_spent_on_page, 10, 300);
  
  // Get channel influence
  const channelScore = getChannelScore(params.marketing_channel);
  
  // Calculate weighted sum
  const weightedSum = 
    modelConfig.featureWeights.marketing_channel * channelScore +
    modelConfig.featureWeights.product_views * normalizedViews +
    modelConfig.featureWeights.image_quality * normalizedImageQuality +
    modelConfig.featureWeights.review_count * normalizedReviews +
    modelConfig.featureWeights.time_spent_on_page * normalizedTimeSpent;
  
  // Apply sigmoid to get probability
  return 1 / (1 + Math.exp(-10 * (weightedSum - 0.5)));
}

// Calculate feature contributions to the prediction
export function calculateFeatureContributions(
  params: SimulationParameters,
  modelConfig: AttributionModelConfig = DEFAULT_MODEL_CONFIG
): Record<keyof SimulationParameters, number> {
  const normalizedViews = normalize(params.product_views, 1, 10);
  const normalizedImageQuality = normalize(params.image_quality, 1, 5);
  const normalizedReviews = normalize(params.review_count, 0, 100);
  const normalizedTimeSpent = normalize(params.time_spent_on_page, 10, 300);
  const channelScore = getChannelScore(params.marketing_channel);
  
  const total = predictConversion(params, modelConfig);
  
  return {
    marketing_channel: channelScore * modelConfig.featureWeights.marketing_channel / total,
    product_views: normalizedViews * modelConfig.featureWeights.product_views / total,
    image_quality: normalizedImageQuality * modelConfig.featureWeights.image_quality / total,
    review_count: normalizedReviews * modelConfig.featureWeights.review_count / total,
    time_spent_on_page: normalizedTimeSpent * modelConfig.featureWeights.time_spent_on_page / total
  };
}

// Get feature impact delta when changing one parameter
export function getFeatureImpactDelta(
  baseParams: SimulationParameters,
  changedParams: SimulationParameters
): number {
  const basePrediction = predictConversion(baseParams);
  const newPrediction = predictConversion(changedParams);
  
  return newPrediction - basePrediction;
}

// Analyze dataset and calculate actual conversion rates
export function analyzeDataset(data: UserInteractionData[]): {
  overallConversionRate: number;
  conversionByChannel: Record<string, number>;
  averageValues: Record<string, number>;
} {
  const totalRecords = data.length;
  const totalConversions = data.filter(d => d.conversion === 1).length;
  
  // Conversions by channel
  const channelGroups = data.reduce<Record<string, {total: number, converted: number}>>((acc, item) => {
    if (!acc[item.marketing_channel]) {
      acc[item.marketing_channel] = { total: 0, converted: 0 };
    }
    acc[item.marketing_channel].total += 1;
    acc[item.marketing_channel].converted += item.conversion;
    return acc;
  }, {});
  
  const conversionByChannel = Object.entries(channelGroups).reduce<Record<string, number>>((acc, [channel, stats]) => {
    acc[channel] = stats.converted / stats.total;
    return acc;
  }, {});
  
  // Average values for each feature
  const sumValues = data.reduce((acc, item) => {
    acc.product_views += item.product_views;
    acc.image_quality += item.image_quality;
    acc.review_count += item.review_count;
    acc.time_spent_on_page += item.time_spent_on_page;
    return acc;
  }, {
    product_views: 0,
    image_quality: 0,
    review_count: 0,
    time_spent_on_page: 0
  });
  
  const averageValues = {
    product_views: sumValues.product_views / totalRecords,
    image_quality: sumValues.image_quality / totalRecords,
    review_count: sumValues.review_count / totalRecords,
    time_spent_on_page: sumValues.time_spent_on_page / totalRecords
  };
  
  return {
    overallConversionRate: totalConversions / totalRecords,
    conversionByChannel,
    averageValues
  };
}
