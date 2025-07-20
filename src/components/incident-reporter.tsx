"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Send } from 'lucide-react';
import type { Incident } from '@/app/dashboard/page';

const formSchema = z.object({
  type: z.string().min(1, 'Please select an incident type.'),
  location: z.string().min(3, 'Location is required.'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface IncidentReporterProps {
  onIncidentReported: (incident: Omit<Incident, 'id'>) => void;
}

export default function IncidentReporter({ onIncidentReported }: IncidentReporterProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        location: "Near highway exit 24",
        description: ""
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onIncidentReported(data);
    reset({
        location: "Near highway exit 24",
        description: "",
        type: undefined
    });
    setOpen(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="absolute bottom-24 right-4 z-20 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90 animate-in zoom-in-50 duration-300"
          aria-label="Report Incident"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report an Incident</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Incident Type</Label>
               <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Accident">Accident</SelectItem>
                            <SelectItem value="Speed Trap">Speed Trap</SelectItem>
                            <SelectItem value="Road Closure">Road Closure</SelectItem>
                        </SelectContent>
                    </Select>
                )}
                />
              {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} placeholder="e.g., I-5 North near Main St"/>
              {errors.location && <p className="text-destructive text-sm">{errors.location.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" {...register('description')} placeholder="e.g., Car flipped over, right lane blocked"/>
            </div>
          </div>
          <DialogFooter>
             <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
