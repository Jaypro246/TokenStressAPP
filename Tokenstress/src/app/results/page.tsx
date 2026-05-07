import Link from 'next/link';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { runSimulation, type SimMode } from '@/lib/simulation';
import ResultsClient from './ResultsClient';

interface Props {
searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function sp(v: string | string[] | undefined): string {
return typeof v === 'string' ? v : '';
}

function num(v: string | string[] | undefined, fallback: number): number {
const n = Number(sp(v));
return isNaN(n) ? fallback : n;
}

interface TokenSnap {
name: string | null;
symbol: string | null;
price: number | null;
liquidity: number | null;
holder: number | null;
}

async function fetchTokenSnap(address: string): Promise<TokenSnap | null> {
if (!address) return null;
try {
const { env } = await getCloudflareContext();
const apiKey = (env as unknown as { BIRDEYE_API_KEY?: string }).BIRDEYE_API_KEY;
if (!apiKey) return null;
const res = await fetch(
`https://public-api.birdeye.so/defi/token_overview?address=${encodeURIComponent(address)}`,
{ headers: { 'x-api-key': apiKey, 'x-chain': 'solana', accept: 'application/json' } }
);
if (!res.ok) return null;
const json = (await res.json()) as {
success: boolean;
data: { name?: string; symbol?: string; price?: number; liquidity?: number; holder?: number };
};
if (!json.success || !json.data) return null;
return {
name: json.data.name ?? null,
symbol: json.data.symbol ?? null,
price: json.data.price ?? null,
liquidity: json.data.liquidity ?? null,
holder: json.data.holder ?? null,
};
} catch {
return null;
}
}

export default async function ResultsPage({ searchParams }: Props) {
const p = await searchParams;
const address = sp(p.address);
const rawMode = sp(p.mode);
const validModes: SimMode[] = ['whale-exit', 'liquidity-shock', 'redistribution'];
const mode: SimMode = validModes.includes(rawMode as SimMode) ? (rawMode as SimMode) : 'whale-exit';

const inputs = {
mode,
holders: num(p.holders, 3),
liquidityPct: num(p.liquidityPct, 50),
redistributionPct: num(p.redistributionPct, 30),
};

const result = validModes.includes(rawMode as SimMode) ? runSimulation(inputs) : null;
const token = result ? await fetchTokenSnap(address) : null;

const simBackUrl = address ? `/simulation?address=${address}` : '/simulation';
const tokenBackUrl = address ? `/token/${address}` : '/';

const afterLiquidity =
result && token?.liquidity
? token.liquidity * (1 - result.liquidityImpact / 100)
: null;
const afterHolders =
result && token?.holder && mode === 'whale-exit'
? token.holder - inputs.holders
: null;

if (!result) {
return (
<div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
<nav className="text-xs text-muted-foreground flex items-center gap-2">
<Link href="/" className="hover:text-foreground transition-colors">Home</Link>
<span>/</span>
<span className="text-foreground">Results</span>
</nav>
<div className="border border-dashed border-border rounded-xl p-10 text-center">
<p className="text-muted-foreground font-medium">No simulation results yet</p>
<p className="text-xs text-muted-foreground/60 mt-1">
Go back to the simulation page, configure a scenario, and click Run Simulation.
</p>
<Link href="/simulation" className="mt-4 inline-block text-sm text-primary hover:underline">
Start a simulation →
</Link>
</div>
</div>
);
}

return (
<ResultsClient
result={result}
token={token}
inputs={inputs}
address={address}
simBackUrl={simBackUrl}
tokenBackUrl={tokenBackUrl}
afterLiquidity={afterLiquidity}
afterHolders={afterHolders}
/>
);
}
