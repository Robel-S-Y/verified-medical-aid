# 🏥 Verified Medical Aid - REST API

*A Final Project Submission - Building a Trustworthy Medical Donation Platform*

[![Postman Collection](https://img.shields.io/badge/Postman-Collection-orange?style=for-the-badge&logo=postman)](https://robelyidenekal-8119569.postman.co/workspace/Robel-Yidenekal's-Workspace~2accc88d-5ce9-4399-8f96-d5381e34b89f/collection/47579322-d552ceec-fb59-4c18-a333-13fb1c8f3262?action=share&source=collection_link&creator=47579322)
![GitHub last commit](https://img.shields.io/github/last-commit/Robel-S-Y/verified-medical-aid)
![GitHub](https://img.shields.io/github/license/Robel-S-Y/verified-medical-aid)

## 📋 Project Overview

**Verified Medical Aid** is a comprehensive backend system developed as a final project submission. This platform implements a robust, secure, and transparent REST API that connects hospitals, patients, and donors through a verified medical donation ecosystem.

## 🚀 Project Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Redis server (for caching and blacklist)
- Stripe account for payment processing

### Installation Steps
```bash
# Clone the project repository
git clone https://github.com/Robel-S-Y/verified-medical-aid.git

# Navigate to project directory
cd verified-medical-aid

# Install project dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations
npx sequelize-cli db:migrate

# Start the development server
npm run start:dev
```

## 🏗️ Project Architecture

### Technical Stack
- **Backend Framework:** Nest.js
- **Database:** PostgreSQL with Sequelize ORM
- **Authentication:** JWT with role-based guards
- **Caching:** Redis for performance optimization
- **Payment Processing:** Stripe API integration
- **Migration Tool:** Sequelize CLI
- **Validation:** DTO-based request validation

### Project Structure
```
verified-medical-aid/
├── config/
│   └── database.cjs                 # Sequelize configuration
├── db/
│   └── migrations/                  # Database migration files
├── models/                          # Sequelize model definitions
├── src/
│   ├── auth/                        # Authentication system
│   │   ├── auth-roles.guard.ts     # Role-based access control
│   │   ├── public.decorator.ts     # Public route decorator
│   │   ├── roles.decorator.ts      # Role requirement decorator
│   │   └── blacklist/              # JWT blacklist management
│   ├── donations/                   # Donation processing
│   │   ├── dto/                    # Donation data transfer objects
│   │   ├── donations.controller.ts
│   │   ├── donations.service.ts
│   │   └── webhooks.controller.ts  # Stripe webhook handling
│   ├── hospitals/                   # Hospital management
│   │   ├── dto/                    # Hospital DTOs
│   │   ├── hospitals.controller.ts
│   │   └── hospitals.service.ts
│   ├── patients/                    # Patient management
│   │   ├── dto/                    # Patient DTOs
│   │   ├── patients.controller.ts
│   │   └── patients.service.ts
│   ├── redis/                       # Redis caching system
│   │   ├── interceptor/            # Cache interceptors
│   │   ├── cache.decorator.ts      # Cache decorator
│   │   └── redis-clear.service.ts  # Cache management
│   ├── users/                       # User management
│   │   ├── dto/                    # User DTOs
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   └── utils/                       # Utility functions
│       ├── jwt.util.ts             # JWT utilities
│       └── uuid-not-found.pipe.ts  # UUID validation pipe
```

## 🔐 Implemented Security Features

### Authentication & Authorization
- **JWT-based authentication** with token blacklisting
- **Role-based access control** using custom guards and decorators
- **Public route decorator** for unprotected endpoints
- **Token refresh and logout** mechanisms

### Redis Integration
- **JWT blacklist management** for secure logout
- **API response caching** for improved performance
- **Cache invalidation** on data updates
- **Redis interceptors** for automatic caching

## 📊 Database Schema

### Implemented Models
- **Users** - User accounts with role-based access
- **Hospitals** - Medical institution profiles
- **Patients** - Patient cases with treatment details
- **Donations** - Donation records and payment status
- **Transactions** - Payment transaction history

### Migration Files
```
20251101213259-create-users-table.js
20251112194006-create-hospitals-table.js
20251113175516-create-transactions-table.js
20251113185138-create-patients-table.js
20251113185144-create-donations-table.js
```

## 🛡️ Role-Based Access Control

### 👑 Admin Role
**Permissions:**
- ✅ Verify hospitals and patients (`PATCH /hospitals/verify/:id`, `PATCH /patients/verify/:id`)
- ✅ Access all users (`GET /users`)
- ✅ Monitor all platform activities
- ✅ System-wide oversight

### 🏥 Hospital Role
**Permissions:**
- ✅ Create and manage hospital profile (`POST /hospitals`, `PATCH /hospitals/:id`)
- ✅ Create and update patient cases (`POST /patients`, `PATCH /patients/:id`)
- ✅ View donations for their patients (`GET /donations`)
- ✅ Manage treatment status updates

### ❤️ Donor Role
**Permissions:**
- ✅ Make donations (`POST /donations`)
- ✅ Retry failed payments (`POST /donations/retry`)
- ✅ Browse patient profiles (`GET /patients/:id`)
- ✅ Personal donation history

## 📋 API Endpoints Implementation

### 🔐 Authentication Endpoints
```typescript
// Public routes
POST /users/login          # User authentication
POST /users                # User registration

// Protected routes
POST /users/refresh        # Token refresh
POST /users/logout         # User logout
```

### 🏥 Hospital Management
```typescript
// Hospital role required
POST /hospitals            # Create hospital profile
PATCH /hospitals/:id       # Update hospital (owner only)

// Admin role required
GET /hospitals             # List all hospitals
PATCH /hospitals/verify/:id # Verify hospital status
```

### 🏥 Patient Management
```typescript
// Hospital role required
POST /patients             # Create patient case
GET /patients              # List hospital's patients
PATCH /patients/:id        # Update patient (owner hospital)

// Public access
GET /patients/:id          # Get patient details

// Admin role required
PATCH /patients/verify/:id # Verify patient case
```

### 💝 Donation Processing
```typescript
// Donor/Public access
POST /donations            # Process donation
POST /donations/retry      # Retry failed payment

// Hospital role required
GET /donations             # View donations for patients

// Public access
GET /donations/:id         # Get donation details
```

## 💳 Stripe Integration Features

### Webhook Handling
- **Stripe webhook controller** for payment event processing
- **Secure webhook verification** with Stripe signatures
- **Real-time payment status updates**
- **Failed payment handling and retry logic**

### Payment Flow
```typescript
// Donation DTO structure
{
  donor_id?: string;       // Optional for authenticated donors
  patient_id: string;      // Required - target patient
  guest_name?: string;     // Optional for guest donations
  guest_email?: string;    // Optional for guest notifications
  amount: number;          // Amount in cents
}
```

## 🔧 Development Features

### Data Validation
- **DTO-based validation** for all incoming requests
- **UUID validation pipe** for route parameters
- **Input sanitization** and type checking
- **Custom validation decorators**

### Error Handling
- **Global exception filters**
- **Proper HTTP status codes**
- **Structured error responses**
- **Database constraint handling**

### Performance Optimization
- **Redis caching** for frequently accessed data
- **Cache invalidation** on data modifications
- **Database query optimization**
- **Eager loading** for related data

## 🚀 Running the Project

### Development Commands
```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run database migrations
npx sequelize-cli db:migrate

# Generate new migration
npx sequelize-cli migration:generate
```

### Environment Configuration
Required environment variables:
```env
NODE_ENV=environemt //like development...
DB_DIALECT=db dialect
DB_HOST=db hostname
DB_USER=db username
DB_PASSWORD='db passowrd'
DB_NAME=db name
DB_PORT=db port
PORT=hosting port
JWT_SECRET=asccess token jwt key
JWT_SECRET_REFRESH=refresh token jwt key
STRIPE_SECRET_KEY=stripe secret key
STRIPE_WEBHOOK_SECRET=stripe webhook secret key
```

## 🧪 API Testing

### Postman Collection
- Complete API testing suite
- Environment setup guidance
- Authentication flow examples
- All CRUD operation tests

### Testing Endpoints
```bash
# Test authentication
POST {{Base_url}}/users/login

# Test hospital creation
POST {{Base_url}}/hospitals
Authorization: Bearer {{hospital_token}}

# Test donation processing
POST {{Base_url}}/donations
Authorization: Bearer {{donor_token}}
```

## 📈 Project Implementation Status

### ✅ Completed Modules
- [x] User authentication and authorization
- [x] Hospital management with verification
- [x] Patient case management
- [x] Donation processing with Stripe
- [x] Redis caching and blacklist
- [x] Database migrations and models
- [x] Role-based access control
- [x] Input validation and error handling

### 🔄 Database Relations
- Users ↔ Hospitals (One-to-Many)
- Hospitals ↔ Patients (One-to-Many)
- Patients ↔ Donations (One-to-Many)
- Users ↔ Donations (One-to-Many)
- Donations ↔ Transactions (One-to-Many)

## 🎯 Key Technical Achievements

### Architecture Patterns
- **Modular design** with feature-based organization
- **Repository pattern** with Sequelize ORM
- **DTO pattern** for request/response validation
- **Interceptor pattern** for cross-cutting concerns
- **Guard pattern** for route protection

### Security Implementation
- **JWT with blacklist** for secure authentication
- **Role-based guards** for endpoint protection
- **Input validation** with class-validator
- **SQL injection prevention** through ORM
- **Secure payment processing** with Stripe

## 📚 Learning Outcomes Demonstrated

This project showcases proficiency in:
- **Nest.js framework** and modular architecture
- **PostgreSQL with Sequelize ORM**
- **Redis integration** for caching and security
- **RESTful API design** principles
- **JWT authentication** and authorization
- **Stripe payment integration**
- **Database migrations** and schema design
- **Error handling** and validation techniques

---

**Project Submitted By:** Robel Yidenekal  
**Repository:** [github.com/Robel-S-Y/verified-medical-aid](https://github.com/Robel-S-Y/verified-medical-aid)  
**Database:** PostgreSQL with Sequelize ORM  
**Cache:** Redis for performance and security

---
*This project represents comprehensive backend development skills with focus on security, scalability, and real-world payment integration.*
