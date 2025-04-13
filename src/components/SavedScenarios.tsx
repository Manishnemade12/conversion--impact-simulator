
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimulationParameters } from '@/types/attributionModel';
import { Trash2, Save, BarChart3, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

interface SavedScenario {
  id: string;
  name: string;
  params: SimulationParameters;
  conversionRate: number;
  date: string;
}

interface SavedScenariosProps {
  currentParams: SimulationParameters;
  onApplyScenario: (params: SimulationParameters) => void;
}

const SavedScenarios: React.FC<SavedScenariosProps> = ({ currentParams, onApplyScenario }) => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([
    {
      id: "scenario-1",
      name: "Facebook Ad Campaign",
      params: {
        marketing_channel: "Ad",
        product_views: 4,
        image_quality: 4,
        review_count: 25,
        time_spent_on_page: 150
      },
      conversionRate: 0.68,
      date: "2025-03-15"
    },
    {
      id: "scenario-2",
      name: "Email Remarketing",
      params: {
        marketing_channel: "Email",
        product_views: 2,
        image_quality: 3,
        review_count: 18,
        time_spent_on_page: 90
      },
      conversionRate: 0.55,
      date: "2025-04-02"
    },
    {
      id: "scenario-3",
      name: "Influencer Partnership",
      params: {
        marketing_channel: "Influencer",
        product_views: 5,
        image_quality: 5,
        review_count: 32,
        time_spent_on_page: 180
      },
      conversionRate: 0.74,
      date: "2025-04-08"
    }
  ]);
  const [scenarioName, setScenarioName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [compareScenario, setCompareScenario] = useState<SavedScenario | null>(null);

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast.error("Please enter a scenario name");
      return;
    }

    const newScenario: SavedScenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      params: { ...currentParams },
      conversionRate: Math.random() * 0.3 + 0.5, // Simulated conversion rate between 0.5 and 0.8
      date: new Date().toISOString().split('T')[0]
    };

    setScenarios([...scenarios, newScenario]);
    setScenarioName("");
    setDialogOpen(false);
    toast.success("Scenario saved successfully");
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
    toast.success("Scenario deleted");
  };

  const handleApplyScenario = (scenario: SavedScenario) => {
    onApplyScenario(scenario.params);
    toast.success(`Applied scenario: ${scenario.name}`);
  };

  const handleCompareScenario = (scenario: SavedScenario) => {
    setCompareScenario(compareScenario?.id === scenario.id ? null : scenario);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Scenarios</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current Scenario</DialogTitle>
              <DialogDescription>
                Give your scenario a name to save it for future reference.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Summer Campaign 2025"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveScenario}>Save Scenario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className={compareScenario?.id === scenario.id ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{scenario.name}</CardTitle>
                  <CardDescription>Saved on {scenario.date}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleCompareScenario(scenario)}
                    className={compareScenario?.id === scenario.id ? "bg-primary/20" : ""}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteScenario(scenario.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Channel: <span className="font-medium">{scenario.params.marketing_channel}</span></div>
                <div>Views: <span className="font-medium">{scenario.params.product_views}</span></div>
                <div>Image Quality: <span className="font-medium">{scenario.params.image_quality}</span></div>
                <div>Reviews: <span className="font-medium">{scenario.params.review_count}</span></div>
                <div>Time on Page: <span className="font-medium">{scenario.params.time_spent_on_page}s</span></div>
                <div>Conv. Rate: <span className="font-medium">{(scenario.conversionRate * 100).toFixed(1)}%</span></div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleApplyScenario(scenario)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Apply This Scenario
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {compareScenario && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Comparison with "{compareScenario.name}"</h4>
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-y-2 text-sm">
                <div className="font-medium">Parameter</div>
                <div className="font-medium">Current</div>
                <div className="font-medium">Saved Scenario</div>
                
                <div>Marketing Channel</div>
                <div>{currentParams.marketing_channel}</div>
                <div>{compareScenario.params.marketing_channel}</div>
                
                <div>Product Views</div>
                <div className={currentParams.product_views > compareScenario.params.product_views ? "text-green-600 font-medium" : 
                               currentParams.product_views < compareScenario.params.product_views ? "text-red-600 font-medium" : ""}>
                  {currentParams.product_views}
                </div>
                <div>{compareScenario.params.product_views}</div>
                
                <div>Image Quality</div>
                <div className={currentParams.image_quality > compareScenario.params.image_quality ? "text-green-600 font-medium" : 
                               currentParams.image_quality < compareScenario.params.image_quality ? "text-red-600 font-medium" : ""}>
                  {currentParams.image_quality}
                </div>
                <div>{compareScenario.params.image_quality}</div>
                
                <div>Review Count</div>
                <div className={currentParams.review_count > compareScenario.params.review_count ? "text-green-600 font-medium" : 
                               currentParams.review_count < compareScenario.params.review_count ? "text-red-600 font-medium" : ""}>
                  {currentParams.review_count}
                </div>
                <div>{compareScenario.params.review_count}</div>
                
                <div>Time on Page (s)</div>
                <div className={currentParams.time_spent_on_page > compareScenario.params.time_spent_on_page ? "text-green-600 font-medium" : 
                               currentParams.time_spent_on_page < compareScenario.params.time_spent_on_page ? "text-red-600 font-medium" : ""}>
                  {currentParams.time_spent_on_page}
                </div>
                <div>{compareScenario.params.time_spent_on_page}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SavedScenarios;
