import { Suspense } from 'react';
import SimulationClient from './SimulationClient';

export default function SimulationPage() {
return (
<Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-10 text-muted-foreground text-sm">Loading simulation...</div>}>
<SimulationClient />
</Suspense>
);
}


