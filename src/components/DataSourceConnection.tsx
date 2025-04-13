
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Database, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const DataSourceConnection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("connected");
  const [googleAnalyticsKey, setGoogleAnalyticsKey] = useState("UA-123456789-1");
  const [facebookApiKey, setFacebookApiKey] = useState("");
  const [shopifyApiKey, setShopifyApiKey] = useState("");
  const [shopifyDomain, setShopifyDomain] = useState("");
  
  const handleConnect = (source: string) => {
    toast.success(`Connected to ${source} successfully`);
  };
  
  const handleRefresh = (source: string) => {
    toast.success(`Refreshed data from ${source}`);
  };
  
  const handleDisconnect = (source: string) => {
    toast.success(`Disconnected from ${source}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Data Sources</h3>
        <Badge variant="outline" className="ml-2">Premium Feature</Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connected">Connected Sources</TabsTrigger>
          <TabsTrigger value="available">Available Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connected" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Google Analytics</CardTitle>
                  <CardDescription>Web analytics data source</CardDescription>
                </div>
                <Badge className="bg-green-600">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Property ID: <span className="font-medium">{googleAnalyticsKey}</span></div>
                <div>Last Update: <span className="font-medium">2 hours ago</span></div>
                <div>Status: <span className="text-green-600 font-medium flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Active</span></div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 justify-between">
              <Button variant="outline" size="sm" onClick={() => handleRefresh("Google Analytics")}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDisconnect("Google Analytics")}>
                <XCircle className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center text-muted-foreground text-sm p-6">
            <p>Connect more data sources to improve your attribution model accuracy.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Facebook Ads</CardTitle>
              <CardDescription>Connect to your Facebook Ads account to import campaign data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fb-api-key" className="text-right">API Key</Label>
                  <Input 
                    id="fb-api-key"
                    type="password"
                    value={facebookApiKey}
                    onChange={(e) => setFacebookApiKey(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={() => handleConnect("Facebook Ads")}>Connect</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shopify</CardTitle>
              <CardDescription>Connect to your Shopify store to import sales and conversion data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shopify-domain" className="text-right">Store URL</Label>
                  <Input 
                    id="shopify-domain"
                    value={shopifyDomain}
                    onChange={(e) => setShopifyDomain(e.target.value)}
                    placeholder="yourstore.myshopify.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shopify-api-key" className="text-right">API Key</Label>
                  <Input 
                    id="shopify-api-key"
                    type="password"
                    value={shopifyApiKey}
                    onChange={(e) => setShopifyApiKey(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto" onClick={() => handleConnect("Shopify")}>Connect</Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base">Google Ads</CardTitle>
              <CardDescription>Coming soon - Connect to your Google Ads account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-4">
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceConnection;
