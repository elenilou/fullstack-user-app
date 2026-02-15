# Docker Setup - Οδηγός Εκτέλεσης

## Προαπαιτούμενα
- Docker Desktop εγκατεστημένο ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (συμπεριλαμβάνεται στο Docker Desktop)

## Τρέξιμο του Project

### 1. **Πρώτη εκτέλεση**
```bash
docker-compose up --build
```
- `-build`: Κατασκευάζει τις εικόνες (images) πρώτη φορά
- Περιμένετε 2-3 λεπτά για τα builds

### 2. **Επόμενες εκτελέσεις**
```bash
docker-compose up
```

### 3. **Τερματισμός**
```bash
docker-compose down
```

## Πρόσβαση στο Application

| Υπηρεσία | URL | Περιγραφή |
|----------|-----|----------|
| Frontend | http://localhost:3000 | React UI |
| Backend API | http://localhost:8080 | Spring Boot API |
| Database | localhost:3307 | MySQL (για clients) |

## Χρήσιμες Εντολές

```bash
# Δείτε τα logs
docker-compose logs -f

# Logs μόνο για το backend
docker-compose logs -f backend

# Δείτε τα containers που τρέχουν
docker-compose ps

# Εκτελέστε εντολή μέσα σε container
docker-compose exec backend bash

# Σβήστε όλα (containers, networks, volumes)
docker-compose down -v
```

## Περιβάλλον Μεταβλητών

Το σύστημα χρησιμοποιεί τα εξής defaults:
- **Database**: user_management_db
- **DB Username**: root
- **DB Password**: (κενό)
- **Backend port**: 8080
- **Frontend port**: 3000
- **DB port**: 3307

Αν θέλετε να αλλάξετε, δημιουργήστε αρχείο `.env` στη ρίζα:
```env
DB_USERNAME=custom_user
DB_PASSWORD=custom_password
```

## Διαχείριση της ΒΔ

### MySQL Client
```bash
# Συνδεθείτε στη ΒΔ από το container
docker-compose exec db mysql -uroot user_management_db
```

### Backups
```bash
# Δημιουργήστε backup
docker-compose exec db mysqldump -uroot user_management_db > backup.sql

# Επαναφορά από backup
docker-compose exec -T db mysql -uroot user_management_db < backup.sql
```

## Troubleshooting

### Σφάλμα: "Cannot connect to database"
```bash
# Χρειάζεται χρόνος για να ξεκινήσει η ΒΔ
docker-compose restart backend
```

### Θέλω να ξεκινήσω από την αρχή
```bash
docker-compose down -v
docker-compose up --build
```

### Port κατειλημμένο (π.χ. 3000, 8080)
```bash
# Αλλάξτε το docker-compose.yml:
# ports:
#   - "3001:3000"  (από 3000 σε 3001)
```

## Κάντε Push στο Docker Hub (προαιρετικά)

```bash
# Login
docker login

# Tag της εικόνας
docker tag spring-backend yourusername/user-registry-backend:1.0
docker tag react-frontend yourusername/user-registry-frontend:1.0

# Push
docker push yourusername/user-registry-backend:1.0
docker push yourusername/user-registry-frontend:1.0
```

---
✅ Έτοιμο! Άλλοι μπορούν να κλωνοποιήσουν το repo και να τρέξουν `docker-compose up --build`
