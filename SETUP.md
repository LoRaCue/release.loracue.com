# Setup Guide for release.loracue.com

This guide walks through setting up the release.loracue.com repository and Vercel deployment.

## 📋 Prerequisites

- GitHub account with access to LoRaCue organization
- Vercel account
- RSA-4096 private key from LoRaCue/loracue repository

## 🚀 Step-by-Step Setup

### 1. Create Private Repository

```bash
# On GitHub
1. Go to https://github.com/organizations/LoRaCue/repositories/new
2. Repository name: release.loracue.com
3. Visibility: Private
4. Initialize: No (we'll push existing files)
5. Click "Create repository"
```

### 2. Push Initial Files

```bash
# From /tmp/release.loracue.com directory
cd /tmp/release.loracue.com

git init
git add .
git commit -m "chore: initial repository setup"
git branch -M main
git remote add origin git@github.com:LoRaCue/release.loracue.com.git
git push -u origin main
```

### 3. Configure GitHub Secrets

```bash
# Add FIRMWARE_SIGNING_KEY secret
1. Go to https://github.com/LoRaCue/release.loracue.com/settings/secrets/actions
2. Click "New repository secret"
3. Name: FIRMWARE_SIGNING_KEY
4. Value: (paste content of keys/firmware_private.pem from loracue repo)
5. Click "Add secret"
```

### 4. Connect to Vercel

```bash
# On Vercel Dashboard
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select "LoRaCue/release.loracue.com"
4. Configure Project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: public
   - Install Command: (leave empty)
5. Click "Deploy"
```

### 5. Configure Custom Domain

```bash
# On Vercel Project Settings
1. Go to project settings → Domains
2. Add domain: release.loracue.com
3. Follow DNS configuration instructions:
   - Add CNAME record: release.loracue.com → cname.vercel-dns.com
4. Wait for DNS propagation (5-30 minutes)
5. Verify HTTPS certificate is issued
```

### 6. Configure GitHub Token for loracue Repo

```bash
# Create Personal Access Token (PAT)
1. Go to https://github.com/settings/tokens/new
2. Note: "LoRaCue Release Webhook"
3. Expiration: No expiration (or 1 year with renewal reminder)
4. Scopes:
   - repo (all)
5. Click "Generate token"
6. Copy token

# Add to loracue repository
1. Go to https://github.com/LoRaCue/loracue/settings/secrets/actions
2. Click "New repository secret"
3. Name: RELEASE_REPO_TOKEN
4. Value: (paste PAT)
5. Click "Add secret"
```

### 7. Test Workflow

```bash
# Trigger manual workflow run
1. Go to https://github.com/LoRaCue/release.loracue.com/actions
2. Select "Update Release Index" workflow
3. Click "Run workflow"
4. Wait for completion
5. Verify releases.json is generated in public/ directory
```

### 8. Verify Deployment

```bash
# Check endpoints
curl https://release.loracue.com/releases.json
curl https://release-loracue-de.vercel.app/releases.json

# Both should return the same JSON with signature
```

## ✅ Verification Checklist

- [ ] Private repository created
- [ ] All files pushed to main branch
- [ ] FIRMWARE_SIGNING_KEY secret configured
- [ ] Vercel project connected
- [ ] Custom domain configured and HTTPS working
- [ ] RELEASE_REPO_TOKEN added to loracue repo
- [ ] Workflow runs successfully
- [ ] releases.json accessible via HTTPS
- [ ] CORS headers present (Access-Control-Allow-Origin: *)
- [ ] Cache headers configured (max-age=300)

## 🔧 Troubleshooting

### Workflow Fails with "Invalid signature"

- Verify FIRMWARE_SIGNING_KEY matches the public key in keys/firmware_public.pem
- Check that private key is complete (including BEGIN/END markers)

### Vercel Deployment Fails

- Verify public/ directory exists
- Check vercel.json syntax
- Ensure no build command is configured

### Domain Not Working

- Wait for DNS propagation (up to 48 hours, usually 5-30 minutes)
- Verify CNAME record points to cname.vercel-dns.com
- Check Vercel domain settings for SSL certificate status

### Webhook Not Triggering

- Verify RELEASE_REPO_TOKEN has correct permissions
- Check loracue repo workflow logs for webhook errors
- Manually trigger workflow to test

## 📚 Next Steps

After setup is complete:

1. Create a test release in loracue repo
2. Verify webhook triggers update-index workflow
3. Check that releases.json is updated
4. Test LoRaCue Manager integration
5. Monitor Vercel analytics for traffic

## 🔑 Security Notes

- **Never commit** firmware_private.pem to repository
- **Rotate keys** annually or on compromise
- **Monitor** GitHub Actions logs for unauthorized access
- **Review** Vercel access logs periodically
- **Backup** private key securely offline

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/LoRaCue/loracue/issues
- Documentation: https://github.com/LoRaCue/loracue/wiki
