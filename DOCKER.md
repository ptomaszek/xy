# Docker Commands

 
## Development

```bash
sudo systemctl start docker
 
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up --build

# Stop container (if running), rebuild image and start container in one go
docker-compose down && docker-compose up --build

# Run tests in Docker container
docker-compose exec app npm test
```

## Production

Build production image:
```bash
docker build -t minimal-react-app:prod --target production .
```

Run production container:
```bash
docker run -p 5173:5173 minimal-react-app:prod
```

## GitHub Pages Deployment

### GitHub Actions Setup

1. **Repository Settings**: Go to your repository Settings → Pages
2. **Source**: Select "GitHub Actions" as the source
3. **Branch**: Keep the default settings

The workflow will automatically deploy to GitHub Pages when you push to the `main` branch.

**Note**: The GitHub Actions workflow uses `npm install` instead of `npm ci` and removes npm caching to avoid package-lock.json dependency, since you don't have local npm/node installed.
