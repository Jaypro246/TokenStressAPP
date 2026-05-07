'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewTokensFeed } from '@/components/new-tokens-feed';

export default function HomePage() {
const router = useRouter();
const [query, setQuery] = useState('');

function handleSearch(e: React.FormEvent) {
e.preventDefault();
const trimmed = query.trim();
if (trimmed) {
router.push(`/token/${encodeURIComponent(trimmed)}`);
}
}

return (
<div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

{/* Hero / Search */}
<section className="text-center space-y-6 pt-8">
<div className="space-y-3">
<span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
Powered by Birdeye API
</span>
<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
Stress-test any <span className="text-primary">Solana token</span>
</h1>
<p className="text-muted-foreground text-lg max-w-xl mx-auto">
Simulate whale exits, liquidity shocks, and market stress scenarios before trading.
</p>
</div>

<form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
<input
type="text"
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="Enter token address or symbol…"
className="flex-1 bg-input border border-border text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
/>
<button
type="submit"
className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
>
Start Simulation
</button>
</form>

<p className="text-xs text-muted-foreground">
Paste a contract address or search by symbol — e.g. <code className="text-primary/80">SOL</code>, <code className="text-primary/80">JUP</code>
</p>
</section>

{/* New Tokens Section */}
<section className="space-y-4">
<div className="flex items-center justify-between">
<div>
<h2 className="text-lg font-semibold text-foreground">New Tokens <span className="text-muted-foreground font-normal">(Solana)</span></h2>
<p className="text-xs text-muted-foreground mt-0.5">Live from Birdeye — newly launched Solana tokens.</p>
</div>
<span className="text-xs text-muted-foreground border border-border rounded px-2 py-1">Live feed</span>
</div>
<NewTokensFeed />
</section>

{/* How it works */}
<section className="space-y-6">
<h2 className="text-lg font-semibold text-foreground">How TokenStress works</h2>
<div className="grid sm:grid-cols-3 gap-4">
{steps.map((step) => (
<div key={step.n} className="bg-card border border-border rounded-lg p-5 space-y-2 hover:border-primary/40 transition-colors">
<span className="text-2xl font-bold text-primary/80">{step.n}</span>
<h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
<p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
</div>
))}
</div>
</section>

</div>
);
}

const steps = [
{
n: '01',
title: 'Search a token',
desc: 'Enter any Solana token address or symbol to pull its on-chain profile.',
},
{
n: '02',
title: 'Choose a stress scenario',
desc: 'Select from whale exit, liquidity shock, redistribution, time decay, or market stress.',
},
{
n: '03',
title: 'Read your Fragility Index',
desc: 'Get a structural risk score and detailed breakdown of how the token would behave.',
},
];
