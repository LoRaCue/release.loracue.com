#!/usr/bin/env python3
"""Generate releases.json index from GitHub releases."""

import sys
import json
import base64
import hashlib
import requests
from pathlib import Path
from datetime import datetime, timezone
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend


def verify_signature(data: str, signature: str, public_key_path: Path) -> bool:
    """Verify RSA signature."""
    try:
        with open(public_key_path, 'rb') as f:
            public_key = serialization.load_pem_public_key(
                f.read(),
                backend=default_backend()
            )
        
        public_key.verify(
            base64.b64decode(signature),
            data.encode('utf-8'),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False


def sign_data(data: str, private_key_path: Path) -> str:
    """Sign data with RSA private key."""
    with open(private_key_path, 'rb') as f:
        private_key = serialization.load_pem_private_key(
            f.read(),
            password=None,
            backend=default_backend()
        )
    
    signature = private_key.sign(
        data.encode('utf-8'),
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    
    return base64.b64encode(signature).decode('ascii')


def calculate_sha256(data: str) -> str:
    """Calculate SHA-256 hash of string data."""
    return hashlib.sha256(data.encode('utf-8')).hexdigest()


def fetch_releases(repo: str, token: str) -> list:
    """Fetch all releases from GitHub API."""
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }
    
    url = f'https://api.github.com/repos/{repo}/releases'
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()


def download_manifest(url: str, token: str) -> dict:
    """Download and parse manifest.json from release."""
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/octet-stream'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()


def main():
    if len(sys.argv) != 4:
        print(f"Usage: {sys.argv[0]} <github_token> <public_key_pem> <private_key_pem>")
        sys.exit(1)
    
    github_token = sys.argv[1]
    public_key_path = Path(sys.argv[2])
    private_key_path = Path(sys.argv[3])
    
    repo = 'LoRaCue/loracue'
    
    print(f"Fetching releases from {repo}...")
    releases = fetch_releases(repo, github_token)
    
    releases_index = {
        "schema_version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        "latest_stable": None,
        "latest_prerelease": None,
        "releases": []
    }
    
    for release in releases:
        tag_name = release['tag_name']
        version = tag_name.lstrip('v')
        is_prerelease = release['prerelease']
        
        print(f"\nProcessing {tag_name}...")
        
        # Find manifest.json asset
        manifest_asset = None
        for asset in release['assets']:
            if asset['name'] == 'manifest.json':
                manifest_asset = asset
                break
        
        if not manifest_asset:
            print(f"  ⚠️  No manifest.json found, skipping")
            continue
        
        # Download manifest
        try:
            manifest = download_manifest(manifest_asset['browser_download_url'], github_token)
        except Exception as e:
            print(f"  ✗ Failed to download manifest: {e}")
            continue
        
        # Verify manifest signature
        manifest_copy = manifest.copy()
        manifest_signature = manifest_copy.pop('signature', None)
        
        if not manifest_signature:
            print(f"  ✗ No signature in manifest")
            continue
        
        manifest_json = json.dumps(manifest_copy, indent=2, sort_keys=True)
        
        if not verify_signature(manifest_json, manifest_signature, public_key_path):
            print(f"  ✗ Invalid manifest signature")
            continue
        
        print(f"  ✓ Manifest signature verified")
        
        # Calculate manifest SHA256
        manifest_sha256 = calculate_sha256(json.dumps(manifest, indent=2))
        
        # Extract supported boards
        supported_boards = [board['board_id'] for board in manifest.get('boards', [])]
        
        # Extract changelog summary
        changelog = manifest.get('changelog', {})
        changelog_parts = []
        if changelog.get('features'):
            changelog_parts.append(f"{len(changelog['features'])} features")
        if changelog.get('fixes'):
            changelog_parts.append(f"{len(changelog['fixes'])} fixes")
        changelog_summary = ", ".join(changelog_parts) if changelog_parts else "No changes documented"
        
        # Add to index
        release_entry = {
            "version": version,
            "release_type": "prerelease" if is_prerelease else "release",
            "published_at": release['published_at'],
            "commit_sha": manifest.get('commit_sha', ''),
            "tag_name": tag_name,
            "manifest_url": manifest_asset['browser_download_url'],
            "manifest_sha256": manifest_sha256,
            "manifest_signature": manifest_signature,
            "supported_boards": supported_boards,
            "changelog_summary": changelog_summary
        }
        
        releases_index['releases'].append(release_entry)
        
        # Update latest versions
        if not is_prerelease:
            if not releases_index['latest_stable']:
                releases_index['latest_stable'] = version
        else:
            if not releases_index['latest_prerelease']:
                releases_index['latest_prerelease'] = version
        
        print(f"  ✓ Added to index")
    
    # Sign releases.json
    releases_json = json.dumps(releases_index, indent=2, sort_keys=True)
    signature = sign_data(releases_json, private_key_path)
    
    releases_index['signature'] = signature
    
    # Write to file
    output_file = Path('public/releases.json')
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump(releases_index, f, indent=2)
    
    print(f"\n✓ Generated {output_file}")
    print(f"  Total releases: {len(releases_index['releases'])}")
    print(f"  Latest stable: {releases_index['latest_stable']}")
    print(f"  Latest prerelease: {releases_index['latest_prerelease']}")


if __name__ == '__main__':
    main()
