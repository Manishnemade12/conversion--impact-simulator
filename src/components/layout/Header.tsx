
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Home, Save, HelpCircle, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <span className="font-bold text-xl">Attribution Simulator</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <div className={cn(
                  navigationMenuTriggerStyle(), 
                  location.pathname === "/" ? "bg-accent text-accent-foreground" : ""
                )}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/attribution-simulator">
                <div className={cn(
                  navigationMenuTriggerStyle(), 
                  location.pathname === "/attribution-simulator" ? "bg-accent text-accent-foreground" : ""
                )}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Simulator
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Database className="mr-2 h-4 w-4" />
                Data Sources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Connected Data Sources
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Browse and connect to various marketing data sources to improve your attribution modeling.
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </div>
                  <Link
                    to="/attribution-simulator?source=google-analytics"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Google Analytics</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Web traffic and conversion data
                    </p>
                  </Link>
                  <Link
                    to="/attribution-simulator?source=Criteo dataset"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Criteo dataset</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Social media advertising performance
                    </p>
                  </Link>
                  <Link
                    to="/attribution-simulator?source=shopify"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Shopify</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      E-commerce purchase data
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/help">
                <div className={navigationMenuTriggerStyle()}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </div>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center space-x-4">
          {/* <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" /> Save Scenario
          </Button> */}
          {/* <Button size="sm">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
