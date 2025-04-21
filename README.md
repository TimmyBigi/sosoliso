# Sosoliso Flight Booking System

A RESTful API for managing flight bookings, built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

- 🔒 **User Authentication** (JWT)
- 👩‍💼 **Admin Management**
- ✈️ **Flight Management**
- 📝 **Booking System**
- 🛡️ **Input Sanitization**
- ⏱️ **Rate Limiting**
- 📜 **Logging System**

---

## 📋 Prerequisites

- **Node.js** (v23.11.0 )
- **MongoDB**
- **npm** 

---

## ⚙️ Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
 

---

## ▶️ Running the Application

### Development Mode:
```bash
npm run dev
```


---

## 📚 API Endpoints

### **User Routes**
- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/login` - User login

### **Admin Routes**
- `POST /api/v1/admin/create-admin` - Create new admin
- `POST /api/v1/admin/login-admin` - Admin login
- `GET /api/v1/admin/get-all-users` - Get all users (Protected)

### **Flight Routes**
- `POST /api/v1/flight/create-flight` - Create new flight
- `GET /api/v1/flight/get-all-fight` - Get all flights
- `PATCH /api/v1/flight/update-flight-status/:id` - Update flight status
- `DELETE /api/v1/flight/cancel-flight/:id` - Cancel flight
- `POST /api/v1/flight/book-flight` - Book a flight
- `GET /api/v1/flight/get-all-available-flights` - Get available flights
- `GET /api/v1/flight/get-booked-flights` - Get booked flights
- `GET /api/v1/flight/get-cancelled-flights` - Get cancelled flights

---

## 🔒 Security Features

- **JWT Authentication**
- **Request Rate Limiting**
- **MongoDB Query Sanitization**
- **Input Validation**
- **Error Handling**

---

## 🛠️ Tech Stack

- **Express.js**
- **MongoDB/Mongoose**
- **JWT Authentication**
- **Pino Logger**
- **Express Rate Limit**
- **Express Mongo Sanitize**

---

## ❌ Error Handling

The API uses standardized error responses:

```json
{
  "status": "error",
  "message": "Error message details"
}
```

---

## ✅ Success Responses

Successful responses follow this format:

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {}
}
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ✨ Author

Developed by **Abimbola Joshua**.

