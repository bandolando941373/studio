import { Gem } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Gem className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-foreground">
        Rock Identifier
      </h1>
    </div>
  );
}
