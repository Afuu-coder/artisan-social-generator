## Artisan Social Generator

AI-powered social media content generator for artisans, built on Google Cloud. It creates platform-optimized captions, analyzes images, supports speech transcription, translations, basic scheduling, and stores generated content for later use.

### Monorepo layout
- `artisan-social-generator/backend/`: Express server + Cloud clients
  - `functions/`: logic using Vertex AI, Vision, Natural Language, Speech, Translate, BigQuery, DLP
- `artisan-social-generator/frontend/`: React app (plain CRA structure)
  - `src/components/`: main UI components
  - `src/services/`: API client, Firebase init, Cloud helpers
- `artisan-social-generator/deploy/`: App Engine and Cloud Build configs

### Prerequisites
- Node.js 18+
- Google Cloud project with required APIs enabled: Vertex AI, Vision, Natural Language, Speech-to-Text, Translate, BigQuery, DLP, Firestore, Cloud Storage
- Firebase project (for Web SDK: Storage/Firestore)

### Environment variables
Backend (App Engine or local):
- `GOOGLE_CLOUD_PROJECT_ID`=your-gcp-project-id
- Application Default Credentials (ADC):
  - Local: `gcloud auth application-default login` (preferred), or
  - `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service account JSON (do not commit)

Frontend (`artisan-social-generator/frontend/.env`):
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

### Install & run (local)
Backend:
```
cd artisan-social-generator/backend
npm install
npm run dev
```
The server runs on port 8080 by default.

Frontend (served separately or proxy via your setup):
```
cd artisan-social-generator/frontend
npm install
npm start
```

### Key endpoints (backend)
- `POST /api/generate-content` – orchestrates Vertex AI + optional services
- `POST /api/analyze-image` – Vision API analysis
- `POST /api/transcribe-audio` – Speech-to-Text transcription
- `POST /api/schedule-post` – demo scheduler response

### Deployment
App Engine (via Cloud Build):
- `artisan-social-generator/deploy/app.yaml` – runtime and env vars
- `artisan-social-generator/deploy/cloudbuild.yaml` – builds frontend/backend and deploys

Firebase Hosting (optional):
- `artisan-social-generator/deploy/firebase.json` configured to serve `frontend/build` and proxy `/api/**` to functions if used.

### Notes
- Do not commit secrets (service account keys, .env). The repository is configured for push protection.
- The cleaned history intentionally excludes any sensitive files.

### License
MIT


