
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimulationParameters } from '@/types/attributionModel';

interface AttributionModelControlsProps {
  params: SimulationParameters;
  onChange: (params: SimulationParameters) => void;
}

const AttributionModelControls: React.FC<AttributionModelControlsProps> = ({ params, onChange }) => {
  const handleChannelChange = (value: string) => {
    onChange({
      ...params,
      marketing_channel: value as 'Ad' | 'Email' | 'Influencer'
    });
  };

  const handleSliderChange = (field: keyof Omit<SimulationParameters, 'marketing_channel'>, value: number[]) => {
    onChange({
      ...params,
      [field]: value[0]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulation Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="marketing_channel">Marketing Channel</Label>
          <Select 
            value={params.marketing_channel} 
            onValueChange={handleChannelChange}
          >
            <SelectTrigger id="marketing_channel">
              <SelectValue placeholder="Select marketing channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ad">Ad</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Influencer">Influencer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="product_views">Product Views</Label>
            <span className="text-sm text-muted-foreground">{params.product_views}</span>
          </div>
          <Slider 
            id="product_views" 
            min={1} 
            max={10} 
            step={1} 
            value={[params.product_views]} 
            onValueChange={(value) => handleSliderChange('product_views', value)} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="image_quality">Image Quality</Label>
            <span className="text-sm text-muted-foreground">{params.image_quality}</span>
          </div>
          <Slider 
            id="image_quality" 
            min={1} 
            max={5} 
            step={1} 
            value={[params.image_quality]} 
            onValueChange={(value) => handleSliderChange('image_quality', value)} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="review_count">Review Count</Label>
            <span className="text-sm text-muted-foreground">{params.review_count}</span>
          </div>
          <Slider 
            id="review_count" 
            min={0} 
            max={100} 
            step={5} 
            value={[params.review_count]} 
            onValueChange={(value) => handleSliderChange('review_count', value)} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="time_spent_on_page">Time Spent on Page (seconds)</Label>
            <span className="text-sm text-muted-foreground">{params.time_spent_on_page}</span>
          </div>
          <Slider 
            id="time_spent_on_page" 
            min={10} 
            max={300} 
            step={10} 
            value={[params.time_spent_on_page]} 
            onValueChange={(value) => handleSliderChange('time_spent_on_page', value)} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AttributionModelControls;
