import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET() {
const { env } = await getCloudflareContext();
const apiKey = (env as unknown as { BIRDEYE_API_KEY?: string }).BIRDEYE_API_KEY;

if (!apiKey) {
return NextResponse.json({ ok: false, error: 'API key not configured' }, { status: 500 });
}

try {
const res = await fetch(
'https://public-api.birdeye.so/defi/v2/tokens/new_listing?chain=solana&limit=20',
{
headers: {
'x-api-key': apiKey,
accept: 'application/json',
},
}
);

if (!res.ok) {
return NextResponse.json(
{ ok: false, error: `Birdeye returned ${res.status}` },
{ status: 502 }
);
}

const json = (await res.json()) as {
success: boolean;
data: { items: Array<{ address: string; symbol: string; name: string; logoURI?: string | null; liquidity?: number; price?: number; priceChange24h?: number }> };
};

if (!json.success || !Array.isArray(json.data?.items)) {
return NextResponse.json({ ok: false, error: 'Unexpected response shape' }, { status: 502 });
}

// Validate: only keep tokens with a non-empty address
const tokens = json.data.items
.filter((t) => typeof t.address === 'string' && t.address.trim().length > 0)
.map((t) => ({
address: t.address,
symbol: t.symbol ?? null,
name: t.name ?? null,
logoURI: t.logoURI ?? null,
liquidity: t.liquidity ?? null,
price: t.price ?? null,
priceChange24h: t.priceChange24h ?? null,
}));

return NextResponse.json({ ok: true, tokens });
} catch {
return NextResponse.json({ ok: false, error: 'Failed to reach Birdeye' }, { status: 502 });
}
}
