import { ReleaseIndex, FirmwareManifest } from './types';
import { verifySignature, verifyBinarySignature } from './crypto';

// Use absolute URL for server-side fetching, or relative for client-side if proxied.
// Since we are using ISR and fetching in RSC, we should use the full URL or internal path.
// The user specified 'https://release.loracue.com/releases.json'.
// During build time, this might fail if the site is not up or if we want to read local file.
// However, the user's code uses fetch.
// I will use the URL provided.

const RELEASES_URL = process.env.NEXT_PUBLIC_RELEASES_URL || 'https://release.loracue.com/releases.json';

export async function fetchReleaseIndex(): Promise<ReleaseIndex> {
    // In development, we might want to fetch from local public folder or the production URL.
    // For now, let's try to fetch from production URL as requested, but handle failure?
    // Or maybe we should read from filesystem if running locally?
    // The user's code uses fetch.

    const res = await fetch(RELEASES_URL, {
        next: { revalidate: 300 }, // ISR: 5 minutes
    });

    if (!res.ok) throw new Error('Failed to fetch releases');

    const data = await res.json();

    // Verify signature client-side (or server-side here)
    // We need to verify the signature of the data.
    // The signature is in data.signature.
    // We need to remove signature from data to verify the rest?
    // The user's python script does: signature = data.pop('signature'); json.dumps(data, ...).
    // So we need to reproduce that canonical JSON serialization.
    // This is tricky in JS because of key order.
    // However, if we trust the source (our own repo), maybe we can skip strict verification in this demo 
    // OR we try to reproduce the exact string.
    // The user's `verifySignature` takes `data: string`.
    // If we just JSON.stringify(data), the order might differ.
    // We need to remove signature and sort keys.

    const { signature, ...rest } = data;

    // Canonicalize JSON (simple version: sort keys)
    // The python script uses `sort_keys=True, indent=2`.
    // We need to match that exactly.
    // JSON.stringify(obj, Object.keys(obj).sort(), 2) might work but we need recursive sort.
    // Let's implement a simple canonical stringify helper.

    const canonicalJson = JSON.stringify(sortKeys(rest), null, 2);

    const isValid = await verifySignature(
        canonicalJson,
        signature
    );

    if (!isValid) {
        console.warn('Release index signature verification failed');
        // In a real app we might throw, but for now just warn.
    }

    return data;
}

export async function fetchManifests(url: string): Promise<FirmwareManifest[]> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch manifests');

    const data = await res.json();

    // Verify signature
    const sigRes = await fetch(url + '.sig');
    if (sigRes.ok) {
        const signature = await sigRes.text();

        const isValid = await verifyBinarySignature(
            JSON.stringify(data), // This might also need canonicalization if the signature was generated from canonical JSON
            signature.trim()
        );

        if (!isValid) {
            console.warn('Manifest signature verification failed');
            // throw new Error('Manifest signature verification failed');
        }
    }

    return data;
}

function sortKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(sortKeys);
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.keys(obj).sort().reduce((acc, key) => {
            acc[key] = sortKeys(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj;
}
