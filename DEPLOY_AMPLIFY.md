# Deploying SyncVault Pro to AWS Amplify

This guide provides professional instructions for deploying **SyncVault Pro** using AWS Amplify Hosting. This application leverages a modern **Zero-Bundler** architecture (Native ES Modules + Importmaps), which requires specific configuration in the Amplify build pipeline.

## 🏗️ Architecture Overview

SyncVault Pro is designed as a "No-Build" React application. It uses:
- **React 19** via native ESM.
- **Tailwind CSS** via CDN for rapid style injection.
- **Importmaps** for dependency resolution (managed via `esm.sh`).
- **Google Gemini API** for potential future AI-driven file insights.

## 🚀 Step-by-Step Deployment

### 1. Repository Preparation
Ensure your project structure matches the following (no `src/` prefix):
```text
/
├── App.tsx
├── index.tsx
├── index.html
├── components/
├── utils/
└── types.ts
```

### 2. Connect to AWS Amplify
1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify).
2. Click **Create new app** > **Host web app**.
3. Link your GitHub/GitLab repository and select the `main` branch.

### 3. Custom Build Specification (`amplify.yml`)
Because this app does not use a traditional build step (Webpack/Vite/Parcel), you must override the default build settings. Use the following configuration to ensure Amplify serves your raw ESM files correctly:

```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        # No npm build required for Zero-Bundler architecture
        - echo "Skipping build phase..."
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths: []
```

### 4. Injecting the Gemini API Key
The application expects a `process.env.API_KEY` for AI features.
1. In the Amplify sidebar, go to **App settings** > **Environment variables**.
2. Click **Manage variables** > **Add variable**.
3. **Variable**: `API_KEY`
4. **Value**: `[Your Google AI Studio API Key]`
5. Click **Save**.

### 5. Handling SPA Routing (Important)
To ensure the app handles direct browser refreshes correctly (avoiding 404s):
1. Go to **App settings** > **Rewrites and redirects**.
2. Add a rule:
   - **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>`
   - **Target address**: `/index.html`
   - **Type**: `200 (Rewrite)`

## 💻 Local Development
To mirror the production environment locally without a build tool:
```bash
# Using a simple static server
npx serve .

# Or using Python
python3 -m http.server 8000
```

## 🛠️ Troubleshooting
- **MIME Type Errors**: If `.tsx` files fail to load in the browser, ensure your server (Amplify) is serving them with `application/javascript` or `text/javascript`. Amplify Hosting handles this automatically for most standard extensions.
- **Importmap Resolution**: Ensure your `index.html` contains the `<script type="importmap">` block before any module scripts.
- **API Failures**: Check the browser console. If the Gemini API returns a 403, verify the `API_KEY` in Amplify Environment Variables and redeploy.