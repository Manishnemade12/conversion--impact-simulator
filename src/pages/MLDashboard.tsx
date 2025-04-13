
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon, FileDown, FileUp, Server } from "lucide-react";
import { generateMockData } from '@/utils/mockDataGenerator';
import { UserInteractionData } from '@/types/attributionModel';
import { toast } from 'sonner';
import MLModelTraining from '@/components/MLModelTraining';
import { checkMLServiceStatus } from '@/services/mlService';

const MLDashboard: React.FC = () => {
  const [mockData, setMockData] = useState<UserInteractionData[]>([]);
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(null);
  const [customData, setCustomData] = useState<UserInteractionData[] | null>(null);
  const [activeDataset, setActiveDataset] = useState<'mock' | 'custom'>('mock');
  
  // Generate mock data and check service status on component mount
  useEffect(() => {
    setMockData(generateMockData(500));
    
    const checkService = async () => {
      try {
        const status = await checkMLServiceStatus();
        setServiceAvailable(status.available);
      } catch (error) {
        setServiceAvailable(false);
      }
    };
    
    checkService();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate the data structure
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          const requiredFields = [
            'marketing_channel', 'product_views', 'image_quality', 
            'review_count', 'time_spent_on_page', 'conversion'
          ];
          
          const isValid = requiredFields.every(field => field in jsonData[0]);
          
          if (isValid) {
            setCustomData(jsonData);
            setActiveDataset('custom');
            toast.success(`Loaded ${jsonData.length} records from file`);
          } else {
            toast.error("File format is invalid. Missing required fields in data.");
          }
        } else {
          toast.error("Invalid data format. Expected an array of records.");
        }
      } catch (error) {
        toast.error("Failed to parse JSON file");
      }
    };
    
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const data = activeDataset === 'custom' && customData ? customData : mockData;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "attribution_model_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Data exported successfully");
  };

  const activeData = activeDataset === 'custom' && customData ? customData : mockData;

  return (
    <div className="container mx-auto p-4 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Machine Learning Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Train and evaluate machine learning models for attribution analysis
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline" onClick={handleExportData} size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label>
              <FileUp className="mr-2 h-4 w-4" />
              Import Data
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
        </div>
      </div>

      {serviceAvailable === false && (
        <Alert variant="destructive" className="mb-6">
          <Server className="h-4 w-4" />
          <AlertTitle>Python ML Service Not Available</AlertTitle>
          <AlertDescription>
            The Python ML backend is not running. Please start the ML backend service
            by running the Python app in the ml-backend directory.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MLModelTraining data={activeData} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Data Source</CardTitle>
              <CardDescription>
                Select the data source for model training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeDataset} onValueChange={(value) => setActiveDataset(value as 'mock' | 'custom')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mock">Mock Data</TabsTrigger>
                  <TabsTrigger value="custom" disabled={!customData}>Custom Data</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mock" className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Mock Records</p>
                    <p className="text-sm">{mockData.length}</p>
                  </div>
                  
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Using Generated Data</AlertTitle>
                    <AlertDescription>
                      This dataset is synthetically generated with known patterns for demonstration purposes.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4 py-4">
                  {customData ? (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Custom Records</p>
                        <p className="text-sm">{customData.length}</p>
                      </div>
                      
                      <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Using Imported Data</AlertTitle>
                        <AlertDescription>
                          Using your imported dataset for model training and evaluation.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No custom data available.</p>
                      <p className="text-xs mt-2">Import data to use this option.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>ML Backend Setup</CardTitle>
              <CardDescription>
                Instructions for running the Python backend
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Navigate to the <code className="bg-muted px-1 py-0.5 rounded">ml-backend</code> directory</li>
                <li>Install Python 3.8+ if not already installed</li>
                <li>Create a virtual environment: <br/>
                  <code className="bg-muted px-1 py-0.5 rounded">python -m venv venv</code>
                </li>
                <li>Activate the environment:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Windows: <code className="bg-muted px-1 py-0.5 rounded">venv\Scripts\activate</code></li>
                    <li>Mac/Linux: <code className="bg-muted px-1 py-0.5 rounded">source venv/bin/activate</code></li>
                  </ul>
                </li>
                <li>Install dependencies: <br/>
                  <code className="bg-muted px-1 py-0.5 rounded">pip install -r requirements.txt</code>
                </li>
                <li>Run the server: <br/>
                  <code className="bg-muted px-1 py-0.5 rounded">python app.py</code>
                </li>
              </ol>
              
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium">Status:</p>
                <p className={serviceAvailable ? "text-green-500" : "text-red-500"}>
                  {serviceAvailable === null ? 'Checking...' :
                   serviceAvailable ? 'Connected to ML backend' : 'Not connected to ML backend'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MLDashboard;
