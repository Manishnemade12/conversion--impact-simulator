
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Tooltip
} from 'recharts';
import { UserInteractionData } from '@/types/attributionModel';
import { analyzeDataset } from '@/utils/attributionModel';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface DataVisualizationProps {
  data: UserInteractionData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6BCB77'];

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  // Get analysis from the utility function instead of manual calculation
  const analysis = React.useMemo(() => analyzeDataset(data), [data]);
  
  // Channel distribution data
  const channelData = React.useMemo(() => {
    const channels = data.reduce<Record<string, number>>((acc, item) => {
      acc[item.marketing_channel] = (acc[item.marketing_channel] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(channels).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Conversion by channel with actual rates from analysis
  const conversionByChannel = React.useMemo(() => {
    return Object.entries(analysis.conversionByChannel).map(([channel, rate]) => ({
      channel,
      conversionRate: rate * 100
    }));
  }, [analysis]);

  // Time on page vs conversion correlation
  const timeOnPageData = React.useMemo(() => {
    // Group data by time ranges
    const timeRanges: Record<string, {total: number, converted: number}> = {};
    const rangeSize = 60; // 60 second ranges
    
    data.forEach(item => {
      const rangeKey = Math.floor(item.time_spent_on_page / rangeSize) * rangeSize;
      const rangeLabel = `${rangeKey}-${rangeKey + rangeSize}s`;
      
      if (!timeRanges[rangeLabel]) {
        timeRanges[rangeLabel] = { total: 0, converted: 0 };
      }
      
      timeRanges[rangeLabel].total += 1;
      timeRanges[rangeLabel].converted += item.conversion;
    });
    
    return Object.entries(timeRanges)
      .map(([timeRange, stats]) => ({
        timeRange,
        conversionRate: (stats.converted / stats.total) * 100,
        userCount: stats.total
      }))
      .sort((a, b) => {
        // Extract the first number from the range for sorting
        const aTime = parseInt(a.timeRange.split('-')[0]);
        const bTime = parseInt(b.timeRange.split('-')[0]);
        return aTime - bTime;
      });
  }, [data]);

  // Feature impact based on analysis of actual data
  const featureImpact = React.useMemo(() => {
    // Calculate the actual correlation between features and conversion
    const features = ['product_views', 'image_quality', 'review_count', 'time_spent_on_page'];
    const featureCorrelations: Record<string, number> = {};
    
    // Calculate mean values for each feature for converted and non-converted users
    features.forEach(feature => {
      const convertedValues = data.filter(item => item.conversion === 1).map(item => item[feature as keyof UserInteractionData] as number);
      const nonConvertedValues = data.filter(item => item.conversion === 0).map(item => item[feature as keyof UserInteractionData] as number);
      
      const convertedMean = convertedValues.reduce((acc, val) => acc + val, 0) / convertedValues.length;
      const nonConvertedMean = nonConvertedValues.reduce((acc, val) => acc + val, 0) / nonConvertedValues.length;
      
      // Simple impact score based on difference in means
      featureCorrelations[feature] = Math.abs(convertedMean - nonConvertedMean);
    });
    
    // Calculate marketing channel impact
    const channelImpacts: Record<string, number> = {};
    Object.entries(analysis.conversionByChannel).forEach(([channel, rate]) => {
      channelImpacts[channel] = rate * 100; // Scale for visualization
    });
    
    // Calculate total for normalization
    const totalFeatureImpact = Object.values(featureCorrelations).reduce((acc, val) => acc + val, 0);
    const totalChannelImpact = Object.values(channelImpacts).reduce((acc, val) => acc + val, 0);
    
    // Create normalized feature impact data
    const featureData = Object.entries(featureCorrelations).map(([feature, impact]) => ({
      name: feature === 'product_views' ? 'Product Views' :
            feature === 'image_quality' ? 'Image Quality' :
            feature === 'review_count' ? 'Review Count' : 'Time on Page',
      value: (impact / totalFeatureImpact) * 50 // Scale to make it comparable with channel impact
    }));
    
    // Add marketing channel as a feature
    featureData.push({
      name: "Marketing Channel",
      value: (totalChannelImpact / Object.keys(channelImpacts).length) / 2
    });
    
    return featureData.sort((a, b) => b.value - a.value);
  }, [data, analysis]);

  // Export data as CSV
  const exportDataAsCSV = () => {
    const headers = ["user_id", "marketing_channel", "product_views", "add_to_cart", 
                     "image_quality", "review_count", "time_spent_on_page", "conversion"];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        row.user_id,
        row.marketing_channel,
        row.product_views,
        row.add_to_cart,
        row.image_quality,
        row.review_count,
        row.time_spent_on_page,
        row.conversion
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'attribution_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Data Analysis Results</h2>
        <Button onClick={exportDataAsCSV} className="flex items-center gap-2">
          <Download size={16} />
          Export Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">Marketing Channel Distribution</CardTitle>
              <CardDescription>
                {channelData.length} different channels
              </CardDescription>
            </div>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ line: { color: "#0066FF" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">Conversion Rate by Channel</CardTitle>
              <CardDescription>
                Overall conversion: {(analysis.overallConversionRate * 100).toFixed(1)}%
              </CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ bar: { color: "#0066FF" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionByChannel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis 
                    label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="conversionRate" name="Conversion Rate">
                    {conversionByChannel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">Feature Importance</CardTitle>
              <CardDescription>
                Relative impact on conversion
              </CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ bar: { color: "#0066FF" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImpact} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8884d8" name="Impact Score">
                    {featureImpact.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">Time on Page vs Conversion</CardTitle>
              <CardDescription>
                Effect of engagement time on conversion
              </CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ line: { color: "#0066FF" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeOnPageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timeRange" 
                    label={{ value: 'Time Range (seconds)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: 'User Count', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="conversionRate" 
                    stroke="#0088FE"
                    name="Conversion Rate (%)" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="userCount" 
                    stroke="#00C49F" 
                    name="User Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Insights Summary</CardTitle>
          <CardDescription>
            Automatically derived from data analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="space-y-2">
              <h3 className="font-medium">Channel Performance</h3>
              <p className="text-sm text-muted-foreground">
                {Object.entries(analysis.conversionByChannel)
                  .sort((a, b) => b[1] - a[1])[0][0]} has the highest 
                conversion rate at {(Object.entries(analysis.conversionByChannel)
                  .sort((a, b) => b[1] - a[1])[0][1] * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Key Conversion Drivers</h3>
              <p className="text-sm text-muted-foreground">
                {featureImpact[0]?.name} has the strongest correlation 
                with successful conversions
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Time Engagement Insight</h3>
              <p className="text-sm text-muted-foreground">
                Optimal engagement time for conversion: 
                {timeOnPageData.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.timeRange}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualization;
