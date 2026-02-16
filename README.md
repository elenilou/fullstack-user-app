# User Management Application

A modern fullstack web application for managing user registration, storage, and address information. Built with **React** frontend and **Spring Boot** backend, containerized with Docker for easy deployment.

## 📋 Features

✅ **User Registration** - Create new users with personal details  
✅ **User Management** - View, edit, and delete user profiles  
✅ **Address Management** - Add multiple addresses (home/work) per user  
✅ **Date Handling** - Proper timezone-aware birthdate storage and display  
✅ **Responsive UI** - Clean, user-friendly interface  
✅ **Docker Support** - Easy deployment with Docker Compose  

## 🏗️ Project Structure

```
fullstack-user-app/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/example/userregistry/
│   │       ├── controller/     # REST endpoints
│   │       ├── service/        # Business logic
│   │       ├── model/          # JPA entities
│   │       ├── repository/     # Data access
│   │       └── dto/            # Data transfer objects
│   ├── pom.xml                # Maven dependencies
│   └── Dockerfile
│
├── frontend/                   # React UI
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Container orchestration
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18+ |
| **Backend** | Spring Boot | 3.x |
| **Database** | MySQL | 8.0 |
| **Build** | Maven (Backend) | 3.x |
| **Containerization** | Docker & Docker Compose | Latest |

## 📦 Prerequisites

- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** (for cloning the repository)

That's it! Docker handles everything else.

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/elenilou/fullstack-user-app.git
cd fullstack-user-app
```

### 2. Start with Docker
```bash
docker-compose up --build
```

Wait 2-3 minutes for the services to initialize.

### 3. Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:3000](http://localhost:3000) |
| **Backend API** | [http://localhost:8080](http://localhost:8080) |
| **Database** | localhost:3307 (MySQL) |

### 4. Stop the Services
```bash
docker-compose down
```

## 📖 Detailed Docker Documentation

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for:
- Advanced Docker commands
- Environment configuration
- Database management
- Troubleshooting
- Database backups

## 🔌 API Endpoints

### Users
```
POST   /api/users              # Create user
GET    /api/users              # Get all users
GET    /api/users/{id}         # Get user by ID
PUT    /api/users/{id}         # Update user
DELETE /api/users/{id}         # Delete user
```

### Addresses
```
POST   /api/users/{id}/addresses        # Add address to user
DELETE /api/users/{id}/addresses/{aid}  # Remove address from user
```

## 🎯 Features in Detail

### User Registration
- First name, surname, gender (M/F)
- Birthdate with timezone-aware handling
- Home and work address (optional)

### User Details View
- Full user information
- Calculated age from birthdate
- Address list
- Edit/delete options

### Address Management
- Multiple addresses per user
- Address type (work/home)

## 🔧 Development

### Without Docker (Local Setup)

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Making Changes
1. Edit code in your IDE
2. If using Docker: rebuild with `docker-compose up --build`
3. If local: changes auto-reload (frontend) or restart Spring Boot

## 📝 Environment Variables

The Docker setup uses these defaults:

```env
MYSQL_DATABASE=user_management_db
MYSQL_USERNAME=root
MYSQL_PASSWORD=(empty)
DB_HOST=db
DB_PORT=3306
REACT_APP_API_URL=http://localhost:8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

To customize, create a `.env` file in the root directory.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for fullstack learning

---

**Questions?** Check [DOCKER_SETUP.md](./DOCKER_SETUP.md) or open an issue on GitHub!
