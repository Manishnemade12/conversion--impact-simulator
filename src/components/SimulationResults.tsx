
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { SimulationParameters } from '@/types/attributionModel';
import { predictConversion, calculateFeatureContributions } from '@/utils/attributionModel';

interface SimulationResultsProps {
  currentParams: SimulationParameters;
  previousParams?: SimulationParameters;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ 
  currentParams, 
  previousParams 
}) => {
  const currentProbability = predictConversion(currentParams) * 100;
  const previousProbability = previousParams 
    ? predictConversion(previousParams) * 100 
    : null;
  
  const delta = previousProbability !== null 
    ? currentProbability - previousProbability 
    : null;
  
  const featureContributions = calculateFeatureContributions(currentParams);
  
  // Format contributions for display
  const contributionsData = Object.entries(featureContributions).map(([key, value]) => ({
    feature: formatFeatureName(key as keyof SimulationParameters),
    contribution: value,
    score: value * 100
  }));

  // Sort by contribution (highest first)
  contributionsData.sort((a, b) => b.contribution - a.contribution);

  function formatFeatureName(feature: keyof SimulationParameters): string {
    switch(feature) {
      case 'marketing_channel': return 'Marketing Channel';
      case 'product_views': return 'Product Views';
      case 'image_quality': return 'Image Quality';
      case 'review_count': return 'Review Count';
      case 'time_spent_on_page': return 'Time on Page';
      default: return feature;
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Probability</CardTitle>
          <CardDescription>
            Estimated probability of conversion with current parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Probability</span>
                <span className="text-xl font-bold">{currentProbability.toFixed(1)}%</span>
              </div>
              <Progress value={currentProbability} />
            </div>
            
            {delta !== null && (
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-medium">Change from Previous</span>
                <span className={`font-medium ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Attribution</CardTitle>
          <CardDescription>
            Contribution of each feature to the conversion probability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead className="text-right">Relative Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributionsData.map((item) => (
                <TableRow key={item.feature}>
                  <TableCell className="font-medium">{item.feature}</TableCell>
                  <TableCell>{(item.contribution * 100).toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="w-full flex items-center gap-2">
                      <Progress value={item.score} className="h-2" />
                      <span className="text-xs">{item.score.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationResults;
