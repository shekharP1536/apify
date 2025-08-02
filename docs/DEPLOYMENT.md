# Deployment Guide

This guide covers various deployment options for the Apify Web Interface.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/apify)

**Why Vercel?**

- Zero configuration deployment
- Automatic HTTPS and global CDN
- Built-in CI/CD with Git integration
- Excellent Next.js support and optimizations
- Free tier available

**Steps:**

1. Connect your GitHub repository to Vercel
2. Import the project
3. Deploy with default settings
4. Your app will be available at `https://your-project.vercel.app`

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo/apify)

**Configuration:**

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18+

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/your-template)

**Configuration:**

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 🔧 Manual Deployment

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Git (for version control)

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/apify.git
   cd apify
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Start the production server:**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

### Using Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Build and run:**

```bash
# Build the image
docker build -t apify-web-interface .

# Run the container
docker run -p 3000:3000 apify-web-interface
```

### Docker Compose

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  apify-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Run with compose:**

```bash
docker-compose up -d
```

## ☁️ Cloud Platform Deployments

### AWS

#### AWS Amplify

1. **Connect repository** to AWS Amplify
2. **Build settings** (auto-detected):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - "**/*"
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

#### AWS EC2

1. **Launch an EC2 instance** (Ubuntu 20.04 LTS recommended)
2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. **Clone and setup:**
   ```bash
   git clone https://github.com/your-repo/apify.git
   cd apify
   npm install
   npm run build
   ```
4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "apify-web" -- start
   pm2 startup
   pm2 save
   ```

#### AWS Lambda (Serverless)

Install Serverless Next.js:

```bash
npm install -g serverless
npm install serverless-nextjs-plugin
```

**serverless.yml:**

```yaml
service: apify-web-interface

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

plugins:
  - serverless-nextjs-plugin

custom:
  serverless-nextjs:
    memory:
      defaultLambda: 512
      apiLambda: 512
    timeout:
      defaultLambda: 10
      apiLambda: 10
```

Deploy:

```bash
serverless deploy
```

### Google Cloud Platform

#### Cloud Run

1. **Build and push to Container Registry:**

   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/apify-web
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy --image gcr.io/PROJECT-ID/apify-web --platform managed
   ```

#### App Engine

**app.yaml:**

```yaml
runtime: nodejs18

env_variables:
  NODE_ENV: production

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.6
```

Deploy:

```bash
gcloud app deploy
```

### Microsoft Azure

#### Static Web Apps

1. **Create Azure Static Web App**
2. **Connect GitHub repository**
3. **Build configuration** (`.github/workflows/azure-static-web-apps.yml`):

   ```yaml
   name: Azure Static Web Apps CI/CD

   on:
     push:
       branches: [main]
     pull_request:
       types: [opened, synchronize, reopened, closed]
       branches: [main]

   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       name: Build and Deploy Job
       steps:
         - uses: actions/checkout@v2
           with:
             submodules: true
         - name: Build And Deploy
           id: builddeploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/"
             api_location: ""
             output_location: ".next"
   ```

#### Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image apify-web .

# Deploy to Container Instances
az container create \
  --resource-group myResourceGroup \
  --name apify-web \
  --image myregistry.azurecr.io/apify-web:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

## 🌐 Custom Domain Setup

### Vercel

1. **Add domain** in Vercel dashboard
2. **Configure DNS** records:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

### Netlify

1. **Add domain** in site settings
2. **Configure DNS** records:
   - Type: CNAME
   - Name: www
   - Value: your-site.netlify.app

### Cloudflare (for any host)

1. **Add site** to Cloudflare
2. **Update nameservers** to Cloudflare's
3. **Configure DNS** to point to your hosting provider
4. **Enable** proxy and SSL/TLS

## 🔒 SSL/HTTPS Setup

### Automatic SSL

Most modern platforms provide automatic SSL:

- **Vercel**: Automatic Let's Encrypt certificates
- **Netlify**: Automatic Let's Encrypt certificates
- **AWS Amplify**: Automatic certificate management
- **Google Cloud Run**: Automatic HTTPS

### Manual SSL (Nginx)

**Install Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
```

**Obtain certificate:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring & Analytics

### Error Tracking

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

**sentry.client.config.js:**

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

**Vercel Analytics:**

```bash
npm install @vercel/analytics
```

**Google Analytics:**

```javascript
// In app/layout.tsx
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </html>
  );
}
```

## 🔧 Performance Optimization

### Build Optimization

**next.config.ts:**

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/webp", "image/avif"],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

### CDN Configuration

**CloudFront (AWS):**

- Origin: Your hosting domain
- Behavior: Cache GET, HEAD, OPTIONS
- TTL: 86400 seconds for static assets

### Caching Strategy

**Service Worker (optional):**

```javascript
// public/sw.js
const CACHE_NAME = "apify-web-v1";
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**

- Check Node.js version (18+ required)
- Clear cache: `rm -rf .next node_modules && npm install`
- Verify dependencies: `npm audit`

**Runtime Errors:**

- Check environment variables
- Verify API connectivity
- Review browser console for client-side errors

**Performance Issues:**

- Enable compression
- Optimize images
- Use proper caching headers
- Monitor bundle size

### Health Checks

**Basic health endpoint:**

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## 📈 Scaling Considerations

### Horizontal Scaling

- **Load balancer** for multiple instances
- **Database** considerations (if adding persistence)
- **Session management** (if adding authentication)

### Vertical Scaling

- **Memory**: 512MB minimum, 1GB recommended
- **CPU**: 1 vCPU minimum, 2 vCPU for high traffic
- **Storage**: Minimal for stateless app

### Auto-scaling

**Kubernetes:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: apify-web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: apify-web
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

Choose the deployment method that best fits your needs, infrastructure, and budget. For most use cases, Vercel provides the simplest and most effective deployment experience.
