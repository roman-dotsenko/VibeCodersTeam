# JobHelper - AI-Powered Resume Assistant

A comprehensive platform for creating, enhancing, and managing resumes with AI assistance.

## Project Structure

```
├── backend/          # .NET backend API
├── client/           # Next.js frontend application
└── AI2/             # Python AI services
```

## Deployment Information

### Production URLs

- **Frontend**: local
- **Backend API**: https://job-helper-app.azurewebsites.net
- **Python AI Services**: https://jobhelper-py.azurewebsites.net

## Backend (.NET API)

### Local Development

**Prerequisites:**
- .NET 9.0 SDK
- SQL Server or compatible database

**Setup:**
```bash
cd backend
dotnet restore
dotnet build
```

**Configuration:**
Edit `appsettings.Development.json` with your local database connection string and configuration.

**Run:**
```bash
dotnet run
```

The API will be available at `https://localhost:5001` (or the port specified in `launchSettings.json`).

### Deployment to Azure

The backend is deployed to Azure Web Apps at: **https://job-helper-app.azurewebsites.net**

**Deployment Steps:**

1. **Build the application:**
   ```bash
   cd backend
   dotnet publish -c Release -o ./publish
   ```

2. **Deploy via Azure CLI:**
   ```bash
   az login
   az webapp deployment source config-zip --resource-group <resource-group> --name job-helper-app --src ./publish.zip
   ```

3. **Or deploy via Visual Studio:**
   - Right-click the project → Publish
   - Select Azure → Azure App Service (Windows)
   - Choose the existing `job-helper-app` service

**Configuration:**
- Set connection strings and app settings in Azure Portal under Configuration
- Enable Application Insights for monitoring
- Configure CORS settings to allow frontend domain

## Frontend (Next.js)

### Local Development

**Prerequisites:**
- Node.js 18+ and npm

**Setup:**
```bash
cd client
npm install
```

**Environment Variables:**
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000
# Add other environment variables as needed
```

**Run Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Python AI Services

### Local Development

**Prerequisites:**
- Python 3.9+
- pip

**Setup:**
```bash
cd AI2
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file with necessary API keys:
```env
OPENAI_API_KEY=your_key_here
# Add other required keys
```

**Run:**
```bash
python main.py
```

Or with uvicorn for FastAPI:
```bash
uvicorn main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`.

### Deployment to Azure

The Python services are deployed to Azure Web Apps at: **https://jobhelper-py.azurewebsites.net**

**Deployment Steps:**

1. **Prepare requirements:**
   Ensure `requirements.txt` is up to date:
   ```bash
   cd AI2
   pip freeze > requirements.txt
   ```

2. **Deploy via Azure CLI:**
   ```bash
   az webapp up --name jobhelper-py --resource-group <resource-group> --runtime "PYTHON:3.9"
   ```

3. **Or deploy via GitHub Actions:**
   Configure workflow for automatic deployment on push.

**Configuration in Azure:**
- Set Python version in Azure Portal → Configuration → General Settings
- Add environment variables (API keys) in Configuration → Application Settings
- Enable Always On for production workloads
- Configure startup command if needed (e.g., `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`)

## Docker Deployment

For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

## Architecture

- **Backend**: RESTful API built with .NET, handles user authentication, resume CRUD operations
- **Frontend**: Next.js React application with TypeScript, provides user interface
- **Python Services**: AI-powered features including CV enhancement, chat assistance, and quiz generation

## Features

- 📝 Resume creation and management
- 🤖 AI-powered CV enhancement
- 💬 Interactive chat assistant
- 📊 Skills assessment quizzes
- 🌍 Multi-language support (EN, UA, RU)
- 🔐 Secure authentication
- 📱 Responsive design

## API Documentation

- **Backend API**: Access Swagger documentation at `https://job-helper-app.azurewebsites.net/swagger`
- **Python API**: Access API docs at `https://jobhelper-py.azurewebsites.net/docs`

## Monitoring & Logs

- View application logs in Azure Portal → Log Stream
- Use Application Insights for performance monitoring
- Check deployment status in Deployment Center

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues and questions, please open an issue in the repository.
