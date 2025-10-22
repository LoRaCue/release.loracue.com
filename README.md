# LoRaCue Release Index

This private repository hosts the release index for LoRaCue firmware distribution.

## 🏗️ Architecture

```
GitHub Actions → Generate releases.json → Commit → Vercel Auto-Deploy → CDN
```

## 📋 What This Does

1. **Monitors** LoRaCue/loracue releases via webhook and scheduled checks
2. **Downloads** manifest.json from each release
3. **Verifies** signatures with embedded public key
4. **Aggregates** metadata into releases.json
5. **Signs** releases.json with private key
6. **Commits** to repository
7. **Deploys** automatically to Vercel CDN

## 🔐 Security

- **Private Repository**: Keeps signing key secure
- **Public Deployment**: Only releases.json is served via Vercel
- **Signature Verification**: All manifests verified before inclusion
- **Signed Index**: releases.json signed for client verification

## 🌐 Endpoints

- **Production**: https://release.loracue.com/releases.json
- **Vercel Preview**: https://release-loracue-de.vercel.app/releases.json

## 🔧 Setup

### GitHub Secrets

- `FIRMWARE_SIGNING_KEY`: RSA-4096 private key (same as loracue repo)
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Vercel Configuration

1. Connect repository to Vercel
2. Configure custom domain: `release.loracue.com`
3. Enable automatic deployments on push to main
4. Framework Preset: Other
5. Build Command: (none)
6. Output Directory: `public`

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── update-index.yml    # Auto-update workflow
├── keys/
│   └── firmware_public.pem     # Public key for verification
├── scripts/
│   └── generate_releases_index.py
├── public/
│   └── releases.json           # Generated index (auto-committed)
├── vercel.json                 # Vercel configuration
└── README.md
```

## 🔄 Workflow Triggers

1. **Repository Dispatch**: Triggered by loracue repo on new release
2. **Manual**: Via GitHub Actions UI
3. **Scheduled**: Every 6 hours (backup)

## 📊 releases.json Schema

```json
{
  "schema_version": "1.0.0",
  "generated_at": "2025-10-22T16:07:00Z",
  "latest_stable": "0.1.0",
  "latest_prerelease": "0.2.0-alpha.201",
  "releases": [
    {
      "version": "0.2.0-alpha.201",
      "release_type": "prerelease",
      "published_at": "2025-10-22T15:59:00Z",
      "commit_sha": "6458caf",
      "tag_name": "v0.2.0-alpha.201",
      "manifest_url": "https://github.com/LoRaCue/loracue/releases/download/v0.2.0-alpha.201/manifest.json",
      "manifest_sha256": "abc123...",
      "manifest_signature": "def456...",
      "supported_boards": ["heltec_v3"],
      "changelog_summary": "Bug fixes and performance improvements"
    }
  ],
  "signature": "mno345..."
}
```

## 🛠️ Manual Operations

### Regenerate Index

```bash
# Trigger workflow manually
gh workflow run update-index.yml
```

### Verify Signature

```bash
# Extract signature and verify
python3 << 'EOF'
import json
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend

with open('public/releases.json') as f:
    data = json.load(f)

signature = data.pop('signature')
releases_json = json.dumps(data, indent=2, sort_keys=True)

with open('keys/firmware_public.pem', 'rb') as f:
    public_key = serialization.load_pem_public_key(f.read(), backend=default_backend())

try:
    public_key.verify(
        base64.b64decode(signature),
        releases_json.encode('utf-8'),
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    print("✓ Signature valid")
except:
    print("✗ Signature invalid")
EOF
```

## 🔑 Key Rotation

When rotating signing keys:

1. Generate new key pair
2. Update `FIRMWARE_SIGNING_KEY` secret
3. Commit new public key to `keys/firmware_public.pem`
4. Trigger workflow to regenerate releases.json
5. Update LoRaCue Manager with new public key
6. Keep old key for 6 months (backward compatibility)

## 📄 License

This repository is part of the LoRaCue project.  
Licensed under GNU General Public License v3.0.

## 🏙️ Made with ❤️ in Hannover
