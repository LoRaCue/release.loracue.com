import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://release.loracue.com/releases.json', {
            next: { revalidate: 300 }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch releases' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
