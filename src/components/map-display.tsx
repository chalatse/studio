import Image from 'next/image';
import type { RouteData, Incident } from '@/app/dashboard/page';
import { MapPin, XCircle, AlertTriangle, Construction } from 'lucide-react';

interface MapDisplayProps {
  route: RouteData | null;
  incidents: Incident[];
}

const IncidentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Accident': return <XCircle className="h-5 w-5 text-white" fill="hsl(var(--destructive))" />;
    case 'Speed Trap': return <AlertTriangle className="h-5 w-5 text-white" fill="hsl(var(--accent))" />;
    case 'Road Closure': return <Construction className="h-5 w-5 text-white" fill="hsl(var(--primary))" />;
    default: return <MapPin className="h-5 w-5 text-white" fill="gray" />;
  }
};


export default function MapDisplay({ route, incidents }: MapDisplayProps) {
  const incidentPositions = [
    { top: '30%', left: '50%' },
    { top: '60%', left: '40%' },
    { top: '45%', left: '65%' },
    { top: '70%', left: '30%' },
    { top: '25%', left: '75%' },
  ];

  return (
    <div className="absolute inset-0">
      <Image
        src="https://placehold.co/1200x800"
        alt="Map of a city"
        fill
        quality={100}
        style={{objectFit: "cover"}}
        className="opacity-50"
        data-ai-hint="city map"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50" />
      
      {route && (
         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path 
             d="M 20,80 Q 30,40 50,50 T 80,20" 
             stroke="hsl(var(--primary))" 
             strokeWidth="1.5" 
             fill="none" 
             strokeLinecap="round"
             strokeLinejoin="round"
             strokeDasharray="4 4"
             className="animate-pulse"
           />
         </svg>
      )}

      {incidents.map((incident, index) => (
        <div 
          key={incident.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-75"
          style={incidentPositions[index % incidentPositions.length]}
          title={`${incident.type}: ${incident.description}`}
        >
          <div className="p-1 bg-background/80 rounded-full shadow-lg">
             <IncidentIcon type={incident.type} />
          </div>
        </div>
      ))}
    </div>
  );
}
