
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart, LineChart } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketing Attribution Model Simulator</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Evaluate and attribute the contribution of multiple factors to user conversion decisions
          using machine learning models and interactive visualizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <PieChart className="h-12 w-12 mb-2 text-primary" />
            <CardTitle>Data Visualization</CardTitle>
            <CardDescription>
              View distribution of marketing channels, conversion rates, and feature importance
            </CardDescription>
          </CardHeader>
          <CardContent>
            Explore interactive visualizations of your data to gain insights into how different 
            factors affect customer conversion rates.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="h-12 w-12 mb-2 text-primary" />
            <CardTitle>Attribution Model</CardTitle>
            <CardDescription>
              Machine learning model to evaluate feature contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            Use advanced analytics to understand how each factor contributes to customer conversion
            and make data-driven decisions.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <LineChart className="h-12 w-12 mb-2 text-primary" />
            <CardTitle>Impact Simulation</CardTitle>
            <CardDescription>
              Simulate changes to different factors to predict impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            Test hypothetical changes to marketing channels, product views, image quality, and more
            to optimize your conversion strategy.
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Link to="/attribution-simulator">
          <Button size="lg" className="text-lg px-8">
            Launch Simulator
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
