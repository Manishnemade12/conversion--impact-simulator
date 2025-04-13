
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Attribution Model Help Center</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to use the Attribution Model Simulator to optimize your marketing decisions.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is Attribution Modeling?</CardTitle>
            <CardDescription>Understanding how attribution works</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Attribution modeling is a framework for analyzing which touchpoints, or marketing channels, receive credit for a conversion. 
              The model helps marketers understand how different factors influence customer decision-making.
            </p>
            <p>
              This simulator allows you to experiment with different parameters and see how they affect conversion probability, 
              helping you make better decisions about where to allocate your marketing resources.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="getting-started">
            <AccordionTrigger>Getting Started</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Start by exploring the Simulator tab to understand how different parameters affect conversion.</li>
                <li>Use the Data Visualization tab to analyze trends in your mock data.</li>
                <li>Customize your attribution model in the Model Configuration tab.</li>
                <li>Save scenarios to compare different approaches.</li>
                <li>Connect to external data sources for more accurate modeling.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="parameters">
            <AccordionTrigger>Understanding Parameters</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3">
                <li>
                  <strong>Marketing Channel:</strong> The source through which customers discover your product (Ad, Email, Influencer).
                </li>
                <li>
                  <strong>Product Views:</strong> How many times a customer views your product before converting.
                </li>
                <li>
                  <strong>Image Quality:</strong> The quality rating of your product images (1-5).
                </li>
                <li>
                  <strong>Review Count:</strong> The number of reviews for your product.
                </li>
                <li>
                  <strong>Time Spent on Page:</strong> Average time users spend on your product page (in seconds).
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="models">
            <AccordionTrigger>Attribution Model Types</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">RandomForest</h4>
                  <p className="text-sm text-muted-foreground">
                    An ensemble learning method that builds multiple decision trees and merges their predictions.
                    Good for handling complex relationships between features.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">LogisticRegression</h4>
                  <p className="text-sm text-muted-foreground">
                    A statistical model that uses a logistic function to model binary dependent variables.
                    Simple and interpretable, but may miss complex interactions.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">XGBoost</h4>
                  <p className="text-sm text-muted-foreground">
                    An optimized gradient boosting library designed for speed and performance.
                    Often provides the best predictive accuracy among tree-based algorithms.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have more questions about using the Attribution Model Simulator, please contact our support team.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:underline">Contact Support</a>
              <a href="#" className="text-primary hover:underline">View Documentation</a>
              <a href="#" className="text-primary hover:underline">Watch Tutorial</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
