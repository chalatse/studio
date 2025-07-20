import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RouteData } from '@/app/page';

interface AlternativeRoutesProps {
  routes: RouteData[];
  onSelectRoute: (route: RouteData) => void;
}

export default function AlternativeRoutes({ routes, onSelectRoute }: AlternativeRoutesProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg text-foreground">Alternative Routes</h3>
      {routes.map(route => (
        <Card key={route.id} className="bg-card">
          <CardContent className="p-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-muted-foreground text-sm">{route.routeSummary}</p>
              <p className="font-semibold">{route.estimatedTravelTime}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onSelectRoute(route)}>
              Select
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
