# Installment App API Documentation

**Base URL:** `https://aggressive-mercie-syntax12332-8f3f199e.koyeb.app`

---

## 1. Auth APIs

### **User Signup**
- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "name": "Ahmad Dev",
  "email": "ahmad@example.com",
  "password": "password123"
}
```

### **User Login**
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "email": "ahmad@example.com",
  "password": "password123"
}
```

### **Forgot Password (OTP Request)**
- **URL:** `/api/auth/forgot-password`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "email": "ahmad@example.com"
}
```
*Note: Demo OTP is `123456`.*

### **Verify OTP**
- **URL:** `/api/auth/verify-otp`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "email": "ahmad@example.com",
  "otp": "123456"
}
```

### **Reset Password**
- **URL:** `/api/auth/reset-password`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "email": "ahmad@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## 2. Business APIs

### **Business Setup**
- **URL:** `/api/business/setup`
- **Method:** `POST`
- **Headers:** 
  - `Authorization: Bearer <your_jwt_token>`
  - `Content-Type: multipart/form-data`
- **Body (form-data):**
  - `shopName`: `Sherazam Installments`
  - `mobile`: `03001234567`
  - `city`: `Lahore`
  - `logo`: `[Select File]` (Key name should be `logo`)
  - `logoUrl`: `[Optional: if no file, provide URL]`
