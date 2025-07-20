import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Navigation } from 'lucide-react';

interface NavigationControlsProps {
  currentStep: string;
  eta: string;
  onEndNavigation: () => void;
}

export default function NavigationControls({ currentStep, eta, onEndNavigation }: NavigationControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 animate-in slide-in-from-bottom-full duration-500">
      <Card className="bg-background/90 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                <Navigation className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight text-foreground">{currentStep}</p>
              <p className="text-muted-foreground font-semibold">ETA: {eta}</p>
            </div>
          </div>
          <Button size="icon" variant="destructive" className="rounded-full h-12 w-12 flex-shrink-0" onClick={onEndNavigation}>
            <X className="h-6 w-6" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
