# Docker Setup - Quick Start Guide

## Prerequisites
- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Running the Project

### 1. **First Run**
```bash
docker-compose up --build
```
- `--build`: Builds the images for the first time
- Wait 2-3 minutes for the build process to complete

### 2. **Subsequent Runs**
```bash
docker-compose up
```

### 3. **Stop Services**
```bash
docker-compose down
```

## Access the Application

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React UI |
| Backend API | http://localhost:8080 | Spring Boot API |
| Database | localhost:3307 | MySQL (for external clients) |

## Useful Commands

```bash
# View logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# List running containers
docker-compose ps

# Execute command in container
docker-compose exec backend bash

# Remove everything (containers, networks, volumes)
docker-compose down -v
```

## Environment Variables

Default configuration:
- **Database Name**: user_management_db
- **DB Username**: root
- **DB Password**: (empty)
- **Backend Port**: 8080
- **Frontend Port**: 3000
- **Database Port (external)**: 3307

To customize, create a `.env` file in the project root:
```env
DB_USERNAME=custom_user
DB_PASSWORD=your_secure_password
MYSQL_DATABASE=my_user_db
```

## Database Management

### Connect to MySQL
```bash
# Access MySQL shell
docker-compose exec db mysql -uroot user_management_db
```

### Backups and Restore

**Create Backup:**
```bash
docker-compose exec db mysqldump -uroot user_management_db > backup.sql
```

**Restore from Backup:**
```bash
docker-compose exec -T db mysql -uroot user_management_db < backup.sql
```

**Backup with Timestamp:**
```bash
docker-compose exec db mysqldump -uroot user_management_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### "Cannot connect to database" Error
The database takes a few seconds to start. The system has health checks, but if needed:
```bash
docker-compose restart backend
```

### Start Fresh
```bash
# Remove all data and start over
docker-compose down -v
docker-compose up --build
```

### Port Already in Use
If you get "port is already allocated":

**Option 1:** Change ports in docker-compose.yml
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Changed from 3000
  backend:
    ports:
      - "8081:8080"  # Changed from 8080
```

**Option 2:** Kill the process using the port
```bash
# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# On macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Container Exits Immediately
Check the logs:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Out of Memory
Docker might need more resources. Increase memory in Docker Desktop settings:
- Settings → Resources → Memory (increase to 4GB+)

## Health Checks

The compose file includes health checks for the database:
```bash
# Check service health
docker-compose ps

# You should see STATUS like:
# db        ... Up (healthy)
# backend   ... Up
# frontend  ... Up
```

## Development Workflow

### Edit Code and Test
1. Make your code changes
2. Rebuild containers:
   ```bash
   docker-compose up --build
   ```
3. Frontend hot-reloads automatically
4. Backend requires restart (included in rebuild)

### View Real-Time Logs While Developing
```bash
docker-compose up --build -d  # Start in background
docker-compose logs -f        # Watch logs
```

## Performance Tips

- **Faster Builds:** Don't include node_modules in frontend `.dockerignore`
- **Layer Caching:** Docker caches layers - order matters in Dockerfile
- **Volume Mounts:** For development, mount source code directly:
  ```yaml
  frontend:
    volumes:
      - ./frontend/src:/app/src
  ```

## Push Images to Docker Hub (Optional)

Share your containerized app:

```bash
# Login to Docker
docker login

# Tag images
docker tag spring-backend your_username/user-registry-backend:1.0
docker tag react-frontend your_username/user-registry-frontend:1.0

# Push to Docker Hub
docker push your_username/user-registry-backend:1.0
docker push your_username/user-registry-frontend:1.0

# Others can now run:
docker-compose pull  # Download images instead of building
docker-compose up
```

## Production Deployment

When deploying to production:

1. **Set secure environment variables:**
   ```env
   DB_PASSWORD=very_secure_password_here
   DB_USERNAME=prod_user
   ```

2. **Use production-grade database:**
   - Replace MySQL with managed service (RDS, CloudSQL)
   - Use persistent volumes for data

3. **Enable HTTPS:**
   - Use reverse proxy (nginx)
   - Get SSL certificate (Let's Encrypt)

4. **Monitoring & Logging:**
   - Use centralized logging (ELK, Datadog)
   - Set up monitoring alerts

5. **Scale Services:**
   - Use Docker Swarm or Kubernetes
   - Load balancer configuration

## Cleanup

```bash
# Stop services (keeps data)
docker-compose stop

# Remove containers (keeps volumes)
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

## FAQ

**Q: Do I need Docker Compose file for production?**
A: For simple deployments yes, but consider orchestration tools (Kubernetes) for larger systems.

**Q: Can I run without building images?**
A: Yes, if images exist: `docker-compose up`. Use `--build` only when Dockerfiles change.

**Q: How do I change the frontend API URL?**
A: Edit docker-compose.yml: `REACT_APP_API_URL=http://your-backend-url`

**Q: Can I develop locally without Docker?**
A: Yes, see the main README.md for local setup instructions.

---

✅ **Ready to Go!** Others can now clone your repository and run:
```bash
docker-compose up --build
```
