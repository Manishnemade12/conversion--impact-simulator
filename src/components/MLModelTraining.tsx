
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertCircle, CheckCircle, Brain } from "lucide-react";
import { trainModel, evaluateModel, checkMLServiceStatus } from '@/services/mlService';
import { UserInteractionData } from '@/types/attributionModel';

interface MLModelTrainingProps {
  data: UserInteractionData[];
  onModelTrained?: (featureImportances: Record<string, number>) => void;
}

const MLModelTraining: React.FC<MLModelTrainingProps> = ({ data, onModelTrained }) => {
  const { toast } = useToast();
  const [isTraining, setIsTraining] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<{ available: boolean; modelTrained: boolean } | null>(null);
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null);
  const [activeTab, setActiveTab] = useState("train");
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Check ML service status on component mount
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkMLServiceStatus();
        setServiceStatus(status);
      } catch (error) {
        setServiceStatus({ available: false, modelTrained: false });
      }
    };
    
    checkStatus();
  }, []);

  const handleTrainModel = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 200);
      
      // Train the model
      const result = await trainModel(data);
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      
      if (result.success) {
        setServiceStatus(prev => prev ? { ...prev, modelTrained: true } : null);
        toast({
          title: "Model Trained Successfully",
          description: "The attribution model has been trained with your data.",
        });
        
        // Notify parent component of feature importances
        if (onModelTrained) {
          onModelTrained(result.feature_importances);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Training Failed",
          description: result.message || "Failed to train the model.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to ML service. Make sure the Python backend is running.",
      });
      setServiceStatus({ available: false, modelTrained: false });
    } finally {
      setIsTraining(false);
    }
  };

  const handleEvaluateModel = async () => {
    try {
      setIsEvaluating(true);
      const result = await evaluateModel(data);
      
      if (result.success) {
        setMetrics(result.metrics);
        toast({
          title: "Model Evaluation Complete",
          description: "Model performance metrics have been calculated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Evaluation Failed",
          description: result.message || "Failed to evaluate the model.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to ML service. Make sure the Python backend is running.",
      });
      setServiceStatus({ available: false, modelTrained: false });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Format metric values for display
  const formatMetric = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Machine Learning Model
            </CardTitle>
            <CardDescription>
              Train and evaluate an ML model for attribution analysis
            </CardDescription>
          </div>
          {serviceStatus && (
            <Badge variant={serviceStatus.available ? "outline" : "destructive"} className="ml-2">
              {serviceStatus.available ? 
                (serviceStatus.modelTrained ? "Model Ready" : "Service Ready") : 
                "Service Unavailable"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!serviceStatus?.available && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ML Service Unavailable</AlertTitle>
            <AlertDescription>
              The Python ML backend is not connected. Make sure to start the backend server.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="train">Train Model</TabsTrigger>
            <TabsTrigger value="evaluate">Evaluate Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="train" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Train the machine learning model using your current dataset ({data.length} records).
              This will create a model that can predict conversion probability based on user interactions.
            </p>
            
            {isTraining && (
              <div className="space-y-2 my-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Training in progress...</span>
                  <span className="text-sm">{Math.floor(trainingProgress)}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            )}
            
            <Button 
              onClick={handleTrainModel} 
              disabled={isTraining || !serviceStatus?.available}
              className="w-full"
            >
              {isTraining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Training Model...
                </>
              ) : (
                "Train Attribution Model"
              )}
            </Button>
            
            {serviceStatus?.modelTrained && !isTraining && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Model Trained</AlertTitle>
                <AlertDescription>
                  The attribution model has been trained and is ready to use.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="evaluate" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Evaluate the trained model's performance using metrics like accuracy, precision,
              recall, and F1 score.
            </p>
            
            <Button 
              onClick={handleEvaluateModel} 
              disabled={isEvaluating || !serviceStatus?.modelTrained}
              className="w-full"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                "Evaluate Model Performance"
              )}
            </Button>
            
            {metrics && (
              <div className="border rounded-lg p-4 mt-4 space-y-2">
                <h3 className="text-sm font-medium mb-2">Model Performance Metrics</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-base font-medium">{formatMetric(metrics.accuracy)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Precision</p>
                    <p className="text-base font-medium">{formatMetric(metrics.precision)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Recall</p>
                    <p className="text-base font-medium">{formatMetric(metrics.recall)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">F1 Score</p>
                    <p className="text-base font-medium">{formatMetric(metrics.f1)}</p>
                  </div>
                  
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-muted-foreground">AUC-ROC</p>
                    <Progress value={metrics.auc * 100} className="h-2" />
                    <p className="text-xs text-right">{formatMetric(metrics.auc)}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MLModelTraining;
