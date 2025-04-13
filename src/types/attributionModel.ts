
export interface UserInteractionData {
  user_id: string;
  marketing_channel: 'Ad' | 'Email' | 'Influencer';
  product_views: number;
  add_to_cart: 0 | 1;
  image_quality: number;
  review_count: number;
  time_spent_on_page: number;
  conversion: 0 | 1;
}

export interface AttributionModelConfig {
  modelType: 'RandomForest' | 'LogisticRegression' | 'XGBoost';
  featureWeights: {
    marketing_channel: number;
    product_views: number;
    image_quality: number;
    review_count: number;
    time_spent_on_page: number;
  };
}

export interface SimulationParameters {
  marketing_channel: 'Ad' | 'Email' | 'Influencer';
  product_views: number;
  image_quality: number;
  review_count: number;
  time_spent_on_page: number;
}
