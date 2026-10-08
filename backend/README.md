# Coaching Pro - Laravel REST API Backend

Full-stack coaching management backend built with Laravel 12 & MySQL database.

## System Requirements
- PHP >= 8.2 (Running on PHP 8.5)
- MySQL / MariaDB (Database: `coaching_pro_db`)
- Composer

## Configuration
Database credentials in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coaching_pro_db
DB_USERNAME=root
DB_PASSWORD=
```

## Running the Backend
```bash
# Run migrations and seed data
php artisan migrate --seed

# Start the Laravel API Server
php artisan serve --host=127.0.0.1 --port=8000
```

## API Endpoints (Base URL: `http://127.0.0.1:8000/api`)

### Batches
- `GET /batches` - List all batches
- `POST /batches` - Create a new batch (`{ name: string }`)
- `PUT /batches/{id}` - Update batch name/status
- `DELETE /batches/{id}` - Delete a batch

### Students
- `GET /students` - List all students (with payment summary, due amounts)
- `GET /students/{id}` - Student details with attendance and exam history
- `POST /students` - Register a student (`{ name, phone, guardianPhone, batch, feeType, feeAmount, ... }`)
- `PUT /students/{id}` - Update student info
- `DELETE /students/{id}` - Delete student and cascade payments/attendance

### Payments
- `GET /payments` - List all transactions
- `POST /payments` - Record fee payment (`{ studentId, amount, method, date, note }`)
- `DELETE /payments/{id}` - Delete payment

### Attendance
- `GET /attendances` - Get all attendance matrix records
- `POST /attendances` - Bulk save attendance (`{ date, batch, records: { [studentId]: "Present" | "Absent" | "Late" | "Leave" } }`)

### Exams & Marks
- `GET /exams` - List all exams and scores
- `POST /exams` - Create an exam
- `POST /exams/{id}/marks` - Save marks for students
- `DELETE /exams/{id}` - Delete exam

### Expenses
- `GET /expenses` - List coaching operational expenses
- `POST /expenses` - Record an expense (`{ title, amount, category, date }`)
- `DELETE /expenses/{id}` - Delete expense

### Staff
- `GET /staff` - List staff members
- `POST /staff` - Add staff member
- `DELETE /staff/{id}` - Delete staff

### Settings
- `GET /settings` - Get coaching profile and configs
- `POST /settings` - Update coaching name, phone, address, tagline, password

### Online Admissions
- `GET /online-admissions` - List submitted admissions
- `POST /online-admissions` - Submit public admission form
- `POST /online-admissions/{id}/approve` - Approve and convert to active student
- `DELETE /online-admissions/{id}` - Reject admission

### Dashboard Statistics
- `GET /dashboard-stats` - Aggregated real-time metrics (revenue, dues, attendance %, active counts, expenses, net profit)
