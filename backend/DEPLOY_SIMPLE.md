# AWS App Runner Deployment (No Docker Required)

## Easiest Method: GitHub → App Runner

### Step 1: Push to GitHub
```bash
cd /Users/jaswantsoni/Projects/HRMS-lite/backend

git init
git add .
git commit -m "Deploy to AWS App Runner"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite-backend.git
git push -u origin main
```

### Step 2: Deploy on AWS Console

1. **Go to AWS App Runner Console**
   - https://console.aws.amazon.com/apprunner

2. **Create Service**
   - Click "Create service"

3. **Source Configuration**
   - Repository type: **Source code repository**
   - Provider: **GitHub**
   - Click "Add new" to connect GitHub
   - Select repository: `hrms-lite-backend`
   - Branch: `main`
   - Deployment trigger: **Automatic**

4. **Build Settings**
   - Configuration: **Use a configuration file**
   - Configuration file: `apprunner.yaml`

5. **Service Settings**
   - Service name: `hrms-lite-backend`
   - Virtual CPU: **1 vCPU**
   - Virtual memory: **2 GB**

6. **Click "Create & deploy"**

### Step 3: Wait for Deployment
- Takes 3-5 minutes
- You'll get a URL like: `https://abc123.us-east-1.awsapprunner.com`

### Step 4: Test
```bash
# Replace with your App Runner URL
curl https://YOUR-URL.awsapprunner.com/health/
curl https://YOUR-URL.awsapprunner.com/docs
```

---

## Alternative: AWS CLI (No Docker)

### Prerequisites
```bash
# Install AWS CLI
brew install awscli

# Configure
aws configure
```

### Deploy Command
```bash
aws apprunner create-service \
  --service-name hrms-lite-backend \
  --source-configuration '{
    "CodeRepository": {
      "RepositoryUrl": "https://github.com/YOUR_USERNAME/hrms-lite-backend",
      "SourceCodeVersion": {
        "Type": "BRANCH",
        "Value": "main"
      },
      "CodeConfiguration": {
        "ConfigurationSource": "API",
        "CodeConfigurationValues": {
          "Runtime": "PYTHON_3",
          "BuildCommand": "pip install -r requirements.txt",
          "StartCommand": "uvicorn app.main:app --host 0.0.0.0 --port 8000",
          "Port": "8000"
        }
      }
    },
    "AutoDeploymentsEnabled": true,
    "AuthenticationConfiguration": {
      "ConnectionArn": "YOUR_GITHUB_CONNECTION_ARN"
    }
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }' \
  --region us-east-1
```

---

## What Happens Behind the Scenes

1. App Runner pulls your code from GitHub
2. Reads `apprunner.yaml` configuration
3. Runs `pip install -r requirements.txt`
4. Starts app with `uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Provides HTTPS URL automatically

---

## MongoDB Atlas Setup

Ensure MongoDB allows App Runner connections:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## Cost

- **~$5-10/month** for low traffic
- **~$40-50/month** for moderate usage
- Pay only for what you use

---

## Update Deployment

Just push to GitHub:
```bash
git add .
git commit -m "Update API"
git push
```

App Runner auto-deploys in 2-3 minutes!

---

## Get Service URL

After deployment completes:
```bash
aws apprunner list-services --region us-east-1
```

Or check AWS Console → App Runner → Your Service → Default domain

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] AWS App Runner service created
- [ ] Connected to GitHub repo
- [ ] apprunner.yaml detected
- [ ] MongoDB Atlas allows 0.0.0.0/0
- [ ] Service deployed successfully
- [ ] Test /health/ endpoint
- [ ] Check /docs for Swagger

---

## Troubleshooting

**Build fails?**
- Check `requirements.txt` is in root
- Verify `apprunner.yaml` syntax

**Can't connect to MongoDB?**
- Check MongoDB Atlas Network Access
- Verify connection string in database.py

**Service won't start?**
- Check logs in App Runner console
- Verify port 8000 is configured

---

## That's It!

No Docker, no complex setup. Just:
1. Push to GitHub
2. Connect App Runner
3. Deploy

Your API is live with HTTPS! 🚀
