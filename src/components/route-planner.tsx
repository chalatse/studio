"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { optimizeRoute, OptimizeRouteInput, OptimizeRouteOutput } from '@/ai/flows/dynamic-route-optimization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Route } from 'lucide-react';

const formSchema = z.object({
  startLocation: z.string().min(3, "Start location is required."),
  endLocation: z.string().min(3, "End location is required."),
  currentTrafficConditions: z.string().optional(),
  roadClosures: z.string().optional(),
  userPreferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoutePlannerProps {
  onRouteOptimized: (routes: OptimizeRouteOutput[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function RoutePlanner({ onRouteOptimized, isLoading, setIsLoading }: RoutePlannerProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '123 Main St, Anytown, USA',
      endLocation: '789 Oak Ave, Anytown, USA',
      currentTrafficConditions: 'Moderate traffic on the expressway.',
      roadClosures: 'None reported.',
      userPreferences: 'Avoid tolls.',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const routePromises = [
        optimizeRoute(data as OptimizeRouteInput),
        optimizeRoute({ ...data, userPreferences: data.userPreferences + ', prefer scenic route' } as OptimizeRouteInput),
        optimizeRoute({ ...data, userPreferences: data.userPreferences + ', use highways only' } as OptimizeRouteInput),
      ];

      const routes = await Promise.all(routePromises);
      onRouteOptimized(routes);
    } catch (error) {
      console.error("Failed to optimize route:", error);
      onRouteOptimized([]); 
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-20 p-4">
      <Card className="bg-background/80 backdrop-blur-sm shadow-2xl animate-in fade-in-50 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Plan Your Venture</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startLocation">Start Location</Label>
              <Input id="startLocation" {...register('startLocation')} placeholder="e.g., San Francisco, CA" />
              {errors.startLocation && <p className="text-destructive text-sm">{errors.startLocation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endLocation">End Location</Label>
              <Input id="endLocation" {...register('endLocation')} placeholder="e.g., Los Angeles, CA" />
              {errors.endLocation && <p className="text-destructive text-sm">{errors.endLocation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPreferences">Preferences</Label>
              <Textarea id="userPreferences" {...register('userPreferences')} placeholder="e.g., Avoid highways, prefer scenic routes..." rows={2}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Route className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Optimizing...' : 'Find Route'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
