
import { UserInteractionData } from '@/types/attributionModel';

// Helper function to generate data with a normal distribution
function normalDistribution(mean: number, stdDev: number): number {
  // Box-Muller transform
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation
  return z * stdDev + mean;
}

// Helper to clamp a value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Helper to generate weighted random selection
function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

export function generateMockData(count: number = 100): UserInteractionData[] {
  const channels: UserInteractionData['marketing_channel'][] = ['Ad', 'Email', 'Influencer'];
  // Weights for each channel (Ad is most common, Influencer is least common)
  const channelWeights = [0.5, 0.3, 0.2]; 
  
  // Parameters for normal distributions
  const productViewParams = { mean: 4, stdDev: 2 }; // Most products get 2-6 views
  const imageQualityParams = { mean: 3.5, stdDev: 0.8 }; // Most images are average to good quality
  const reviewCountParams = { mean: 25, stdDev: 15 }; // Most products have ~25 reviews
  const timeSpentParams = { mean: 120, stdDev: 60 }; // Most visits are ~2 minutes
  
  // Generate data with these distributions
  return Array.from({ length: count }, (_, index) => {
    // Select channel with weighted probability
    const channel = weightedRandom(channels, channelWeights);
    
    // Generate normally distributed values and clamp to valid ranges
    const productViews = Math.round(clamp(normalDistribution(productViewParams.mean, productViewParams.stdDev), 0, 10));
    const imageQuality = Math.round(clamp(normalDistribution(imageQualityParams.mean, imageQualityParams.stdDev), 1, 5));
    const reviewCount = Math.round(clamp(normalDistribution(reviewCountParams.mean, reviewCountParams.stdDev), 0, 100));
    const timeSpentOnPage = Math.round(clamp(normalDistribution(timeSpentParams.mean, timeSpentParams.stdDev), 10, 300));
    
    // Calculate add_to_cart probability based on other factors
    // Higher image quality, more reviews, and more time spent increase add_to_cart probability
    let addToCartProbability = 0.3; // Base probability
    addToCartProbability += (imageQuality - 3) * 0.1; // Adjust for image quality
    addToCartProbability += (reviewCount / 100) * 0.2; // Adjust for reviews
    addToCartProbability += (timeSpentOnPage / 300) * 0.2; // Adjust for time spent
    
    const addToCart = Math.random() < addToCartProbability ? 1 : 0;
    
    // Conversion is influenced by channel, add_to_cart, and other factors
    let conversionProbability = 0.2; // Base probability
    
    // Different channels have different base conversion rates
    if (channel === 'Ad') conversionProbability += 0.1;
    if (channel === 'Email') conversionProbability += 0.15;
    if (channel === 'Influencer') conversionProbability += 0.25;
    
    // Add to cart is a strong signal
    if (addToCart === 1) conversionProbability += 0.3;
    
    // Other factors have smaller influences
    conversionProbability += (imageQuality - 3) * 0.05;
    conversionProbability += (reviewCount / 100) * 0.1;
    conversionProbability += (timeSpentOnPage / 300) * 0.1;
    
    // Clamp final probability
    conversionProbability = clamp(conversionProbability, 0.05, 0.95);
    
    return {
      user_id: `user_${index + 1}`,
      marketing_channel: channel,
      product_views: productViews,
      add_to_cart: addToCart,
      image_quality: imageQuality,
      review_count: reviewCount,
      time_spent_on_page: timeSpentOnPage,
      conversion: Math.random() < conversionProbability ? 1 : 0
    };
  });
}

// Generate realistic dataset segments
export function generateDatasetSegments(): Record<string, UserInteractionData[]> {
  return {
    highValueCustomers: generateMockData(50).map(data => ({
      ...data,
      time_spent_on_page: Math.round(clamp(normalDistribution(180, 40), 120, 300)),
      product_views: Math.round(clamp(normalDistribution(7, 1.5), 5, 10)),
    })),
    newCustomers: generateMockData(50).map(data => ({
      ...data,
      product_views: Math.round(clamp(normalDistribution(2, 1), 1, 5)),
      marketing_channel: weightedRandom<UserInteractionData['marketing_channel']>(
        ['Ad', 'Influencer', 'Email'], 
        [0.6, 0.3, 0.1]
      ),
    })),
    returningCustomers: generateMockData(50).map(data => ({
      ...data,
      marketing_channel: 'Email' as UserInteractionData['marketing_channel'],
      product_views: Math.round(clamp(normalDistribution(3, 1.2), 1, 8)),
    }))
  };
}
