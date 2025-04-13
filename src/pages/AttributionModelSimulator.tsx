
import React, { useState, useEffect } from 'react';
import { generateMockData, generateDatasetSegments } from '@/utils/mockDataGenerator';
import { UserInteractionData, SimulationParameters, AttributionModelConfig } from '@/types/attributionModel';
import { DEFAULT_MODEL_CONFIG, predictConversion } from '@/utils/attributionModel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Download, BarChart3, Upload } from "lucide-react";
import { toast } from 'sonner';
import AttributionModelControls from '@/components/AttributionModelControls';
import DataVisualization from '@/components/DataVisualization';
import SimulationResults from '@/components/SimulationResults';
import ModelConfiguration from '@/components/ModelConfiguration';
import SavedScenarios from '@/components/SavedScenarios';
import DataSourceConnection from '@/components/DataSourceConnection';
import { useLocation } from 'react-router-dom';

const AttributionModelSimulator: React.FC = () => {
  const location = useLocation();
  const [mockData, setMockData] = useState<UserInteractionData[]>([]);
  const [dataSegments, setDataSegments] = useState<Record<string, UserInteractionData[]>>({});
  const [simulationParams, setSimulationParams] = useState<SimulationParameters>({
    marketing_channel: 'Ad',
    product_views: 3,
    image_quality: 3,
    review_count: 20,
    time_spent_on_page: 120
  });
  const [previousParams, setPreviousParams] = useState<SimulationParameters | undefined>(undefined);
  const [modelConfig, setModelConfig] = useState<AttributionModelConfig>(DEFAULT_MODEL_CONFIG);
  const [activeTab, setActiveTab] = useState("simulator");
  const [dataSource, setDataSource] = useState<string | null>(null);

  // Generate mock data on component mount
  useEffect(() => {
    setMockData(generateMockData(500));
    setDataSegments(generateDatasetSegments());
  }, []);

  // Check for data source parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    if (source) {
      setDataSource(source);
      toast.success(`Loading data from ${source}`);
      // In a real app, this would fetch real data
      setTimeout(() => {
        toast.info(`${source} data loaded successfully`);
      }, 1500);
    }
  }, [location]);

  const handleParameterChange = (params: SimulationParameters) => {
    setPreviousParams(simulationParams);
    setSimulationParams(params);
  };

  const resetSimulation = () => {
    setPreviousParams(undefined);
    setSimulationParams({
      marketing_channel: 'Ad',
      product_views: 3,
      image_quality: 3,
      review_count: 20,
      time_spent_on_page: 120
    });
    setModelConfig(DEFAULT_MODEL_CONFIG);
    toast.success("Simulation reset to default values");
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "attribution_model_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Data exported successfully");
  };

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Attribution Model Simulator</h1>
          <p className="text-muted-foreground mt-2">
            Evaluate and attribution using Criteo Uplift Modeling Dataset.
            {dataSource && <span className="ml-2 text-primary font-medium">· Connected to {dataSource}
              
              </span>}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleExportData} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download the current dataset as JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" onClick={resetSimulation} size="sm">Reset Simulation</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">
            <BarChart3 className="h-4 w-4 mr-2" />
            Simulator
          </TabsTrigger>
          <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          <TabsTrigger value="configuration">Model Configuration</TabsTrigger>
          <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simulator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttributionModelControls 
                  params={simulationParams} 
                  onChange={handleParameterChange} 
                />
                <SimulationResults 
                  currentParams={simulationParams} 
                  previousParams={previousParams} 
                />
              </div>
            </div>
            <div>
              <SavedScenarios 
                currentParams={simulationParams}
                onApplyScenario={handleParameterChange}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visualization" className="mt-6">
          <DataVisualization data={mockData} />
        </TabsContent>
        
        <TabsContent value="configuration" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelConfiguration config={modelConfig} onChange={setModelConfig} />
            <div className="space-y-6">
              <SimulationResults 
                currentParams={simulationParams} 
                previousParams={previousParams} 
              />
              <div className="bg-muted/30 border rounded-lg p-4">
                <h3 className="text-sm font-medium flex items-center mb-2">
                  <HelpCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                  Understanding Model Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adjusting the model configuration changes how different factors are weighted in 
                  the conversion prediction. Higher weights mean that factor has more influence on 
                  the final prediction. The total of all weights should equal 1.0.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data-sources" className="mt-6">
          <DataSourceConnection />
        </TabsContent>
      </Tabs>
      
      {/* Key Metrics Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-3">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-muted-foreground mr-2">Current Model:</span>
              <span className="font-medium">{modelConfig.modelType}</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">Conversion Rate:</span>
              <span className="font-medium">{(predictConversion(simulationParams, modelConfig) * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground mr-2">Data Points:</span>
              <span className="font-medium">{mockData.length}</span>
            </div>
          </div>
          <div>
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              <HelpCircle className="h-3 w-3 mr-1" />
              Attribution Model Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributionModelSimulator;
