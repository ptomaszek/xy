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

# Check container status
docker-compose ps

# Stop all containers
docker-compose down
```

## Production

Build production image:
```bash
docker build -t xy:prod .
```

Run production container:
```bash
docker run -p 5173:5173 xy:prod
```

## GitHub Pages Deployment

### GitHub Actions Setup

1. **Repository Settings**: Go to your repository Settings → Pages
2. **Source**: Select "GitHub Actions" as the source
3. **Branch**: Keep the default settings

The workflow will automatically deploy to GitHub Pages when you push to the `main` branch.

**Note**: The GitHub Actions workflow uses `npm install` instead of `npm ci` and removes npm caching to avoid package-lock.json dependency, since you don't have local npm/node installed.

## Project Structure

This project is a React-based educational game application with the following structure:

- **Games**: Interactive games with configurable difficulty levels
- **Docker**: Full containerization for development and deployment
- **Testing**: Vitest with React Testing Library for component testing
- **Deployment**: GitHub Pages with automated CI/CD

## Development Workflow

1. Start Docker containers: `docker-compose up -d`
2. Access application at: http://localhost:5173
3. Make changes to source code (mounted as volume)
4. Changes are automatically reflected due to hot reload
5. Run tests: `docker-compose exec app npm test`
6. Keep container running when finished with tests to leverage hot reload for ongoing work
