// Ed25519 public key (32 bytes, base64)
const PUBLIC_KEY_BASE64 = 'o8F7VxGLhVKZqBxCQvJ5xKp0YvLqH8vN2wZ3jR4mTkI=';

export async function verifySignature(
    data: string,
    signatureBase64: string
): Promise<boolean> {
    try {
        // Import Ed25519 public key
        const publicKeyBytes = base64ToBytes(PUBLIC_KEY_BASE64);
        const publicKey = await crypto.subtle.importKey(
            'raw',
            publicKeyBytes as BufferSource,
            { name: 'Ed25519' },
            false,
            ['verify']
        );

        // Decode signature
        const signature = base64ToBytes(signatureBase64);
        const dataBytes = new TextEncoder().encode(data);

        // Verify
        return await crypto.subtle.verify(
            'Ed25519',
            publicKey,
            signature as BufferSource,
            dataBytes as BufferSource
        );
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

export async function verifyBinarySignature(
    data: string,
    signatureHex: string
): Promise<boolean> {
    try {
        const publicKeyBytes = base64ToBytes(PUBLIC_KEY_BASE64);
        const publicKey = await crypto.subtle.importKey(
            'raw',
            publicKeyBytes as BufferSource,
            { name: 'Ed25519' },
            false,
            ['verify']
        );

        const signature = hexToBytes(signatureHex);
        const dataBytes = new TextEncoder().encode(data);

        return await crypto.subtle.verify(
            'Ed25519',
            publicKey,
            signature as BufferSource,
            dataBytes as BufferSource
        );
    } catch (error) {
        console.error('Binary signature verification error:', error);
        return false;
    }
}

function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
}

function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}
