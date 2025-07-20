"use client";

import { useState, useEffect } from 'react';
import type { OptimizeRouteOutput } from '@/ai/flows/dynamic-route-optimization';
import MapDisplay from '@/components/map-display';
import RoutePlanner from '@/components/route-planner';
import NavigationControls from '@/components/navigation-controls';
import IncidentReporter from '@/components/incident-reporter';
import AlternativeRoutes from '@/components/alternative-routes';
import { Button } from '@/components/ui/button';
import { LocateFixed, Navigation, Mic, MicOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export type RouteData = OptimizeRouteOutput & { id: number };
export type Incident = { type: string; location: string; description: string; id: number };

export default function Home() {
  const [isPlanning, setIsPlanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mainRoute, setMainRoute] = useState<RouteData | null>(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState<RouteData[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const { toast } = useToast();

  const handleRouteOptimized = (routes: OptimizeRouteOutput[]) => {
    if (routes.length === 0) {
      toast({
        title: "Error",
        description: "Could not generate a route. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    const routesWithIds = routes.map((route, index) => ({ ...route, id: index }));
    setMainRoute(routesWithIds[0]);
    setAlternativeRoutes(routesWithIds.slice(1));
    setIsPlanning(false);
    setIsLoading(false);
  };

  const handleStartNavigation = () => {
    if (mainRoute) {
      setIsNavigating(true);
      const directions = mainRoute.optimizedRoute.split('.').filter(s => s.trim().length > 0);
      speak(`Starting navigation. ${directions[0] || ''}`);
    }
  };
  
  const handleEndNavigation = () => {
    setIsNavigating(false);
    setIsPlanning(true);
    setMainRoute(null);
    setAlternativeRoutes([]);
    setCurrentStep(0);
    if(typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
  };
  
  const handleIncidentReported = (incident: Omit<Incident, 'id'>) => {
    const newIncident = { ...incident, id: Date.now() };
    setIncidents(prev => [...prev, newIncident]);
    toast({
      title: "Incident Reported",
      description: `${incident.type} at ${incident.location} has been reported.`,
    });
  };

  const speak = (text: string) => {
    if (voiceEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  useEffect(() => {
    if (isNavigating && mainRoute) {
      const directions = mainRoute.optimizedRoute.split('.').filter(s => s.trim().length > 0);
      if (directions.length === 0) return;

      const navigationInterval = setInterval(() => {
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep < directions.length) {
            speak(directions[nextStep]);
            return nextStep;
          } else {
            speak("You have arrived at your destination.");
            clearInterval(navigationInterval);
            handleEndNavigation();
            return prevStep;
          }
        });
      }, 7000);

      return () => clearInterval(navigationInterval);
    }
  }, [isNavigating, mainRoute, voiceEnabled]);


  const directions = mainRoute?.optimizedRoute.split('.').filter(s => s.trim().length > 0) || [];

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      <MapDisplay route={mainRoute} incidents={incidents} />

      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <h1 className="text-4xl font-bold text-primary drop-shadow-lg font-headline">Venture Navigator</h1>
        <div className="flex items-center gap-2">
           <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
            <LocateFixed className="h-5 w-5" />
          </Button>
          {isNavigating && (
             <Button size="icon" variant={voiceEnabled ? 'secondary' : 'destructive'} className="rounded-full shadow-lg" onClick={() => setVoiceEnabled(v => !v)}>
              {voiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
      
      {isPlanning && <RoutePlanner onRouteOptimized={handleRouteOptimized} isLoading={isLoading} setIsLoading={setIsLoading} />}

      {!isPlanning && !isNavigating && mainRoute && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm z-10 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-full duration-500">
          <h2 className="text-2xl font-bold text-foreground mb-4">Routes Found</h2>
          <div className="space-y-4">
            <div className="p-4 border-2 border-primary rounded-lg bg-card shadow-md">
              <h3 className="font-bold text-lg text-primary">Main Route</h3>
              <p className="text-muted-foreground">{mainRoute.routeSummary}</p>
              <p className="font-semibold">{mainRoute.estimatedTravelTime}</p>
            </div>
            {alternativeRoutes.length > 0 && <AlternativeRoutes routes={alternativeRoutes} onSelectRoute={(route) => {
                const oldMain = mainRoute;
                setMainRoute(route);
                setAlternativeRoutes(prev => [...prev.filter(r => r.id !== route.id), oldMain]);
            }} />}
            <Button size="lg" className="w-full" onClick={handleStartNavigation}>
              <Navigation className="mr-2 h-5 w-5" />
              Start Navigation
            </Button>
          </div>
        </div>
      )}

      {isNavigating && mainRoute && (
        <NavigationControls
          currentStep={directions.length > 0 ? directions[currentStep] : "Starting route..."}
          eta={mainRoute.estimatedTravelTime}
          onEndNavigation={handleEndNavigation}
        />
      )}
      
      {!isPlanning && <IncidentReporter onIncidentReported={handleIncidentReported} />}
    </div>
  );
}
