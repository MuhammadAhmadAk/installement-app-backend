# Installment App API Documentation (Postman Guide)

**Base URL:** `https://aggressive-mercie-syntax12332-8f3f199e.koyeb.app`

---

## 1. Authentication APIs (`/api/auth`)

### **A. User Signup**
- **URL:** `{{base_url}}/api/auth/signup`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "name": "Ahmad Dev",
  "email": "ahmad@example.com",
  "password": "password123"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Signup successful. Please check your email for verification.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmad Dev",
      "email": "ahmad@example.com"
    }
  }
}
```

### **B. User Login**
- **URL:** `{{base_url}}/api/auth/login`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "email": "ahmad@example.com",
  "password": "password123"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ahmad Dev",
      "email": "ahmad@example.com"
    }
  }
}
```

---

## 2. Customer Management APIs (`/api/customers`)

### **A. List All Customers**
- **URL:** `{{base_url}}/api/customers`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cust-uuid-123",
      "name": "Muhammad Ali",
      "phone": "03001234567",
      "cnic": "35201-1234567-1",
      "address": "House 123, Lahore",
      "reference": "Zeeshan (03001112223)",
      "imageUrl": "https://.../public/uploads/customers/image-123.jpg",
      "businessId": "bus-uuid-456",
      "purchasedCount": 2,
      "balance": "45000.00",
      "amount": "8500.00",
      "statusType": 0,
      "reliability": "95%",
      "createdAt": "2023-10-01T10:00:00.000Z",
      "updatedAt": "2023-10-01T10:00:00.000Z"
    }
  ]
}
```

### **B. Add New Customer**
- **URL:** `{{base_url}}/api/customers`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body (form-data):**
  - `name`: "Ahmad Khan"
  - `phone`: "03217654321"
  - `cnic`: "35201-1234567-1"
  - `address`: "Street 5, Karachi"
  - `reference`: "Zeeshan Ali (03009876543)"
  - `image`: [File] (Key: `image`)
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Customer added successfully",
  "data": {
    "id": "new-cust-uuid",
    "name": "Ahmad Khan",
    "phone": "03217654321",
    "cnic": "35201-1234567-1",
    "address": "Street 5, Karachi",
    "reference": "Zeeshan Ali (03009876543)",
    "imageUrl": "https://.../public/uploads/customers/image-456.png",
    "businessId": "bus-uuid-456",
    "updatedAt": "2023-10-27T12:00:00.000Z",
    "createdAt": "2023-10-27T12:00:00.000Z"
  }
}
```

### **C. Get Customer Details**
- **URL:** `{{base_url}}/api/customers/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cust-uuid-123",
    "name": "Muhammad Ali",
    "phone": "03001234567",
    "cnic": "35201-1234567-1",
    "address": "House 123, Lahore",
    "reference": "Zeeshan (03001112223)",
    "imageUrl": "https://...",
    "products": [
      {
        "id": "prod-uuid-789",
        "title": "Samsung Galaxy A54",
        "date": "2023-10-12",
        "isActive": true,
        "progress": 6,
        "totalProgress": 12,
        "monthlyPrice": "8500.00",
        "remainingBalance": "25000.00",
        "totalSalePrice": "60000.00",
        "downPayment": "10000.00"
      }
    ]
  }
}
```

---

## 3. Product & Installment APIs (`/api/installments`)

### **A. Add Product to Customer (Naya Sauda)**
- **URL:** `{{base_url}}/api/installments/add-product`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "customerId": "cust-uuid-123",
  "productName": "Haier Deep Freezer",
  "costPrice": 50000,
  "profitPercentage": 20,
  "totalSalePrice": 60000,
  "downPayment": 10000,
  "installmentsCount": 12,
  "monthlyAmount": 4166,
  "saleDate": "2023-10-27"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product added to customer successfully",
  "data": {
    "id": "prod-uuid-999",
    "customerId": "cust-uuid-123",
    "productName": "Haier Deep Freezer",
    "costPrice": 50000,
    "profitPercentage": 20,
    "totalSalePrice": 60000,
    "downPayment": 10000,
    "installmentsCount": 12,
    "monthlyAmount": 4166,
    "saleDate": "2023-10-27T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2023-10-27T12:00:00.000Z",
    "updatedAt": "2023-10-27T12:00:00.000Z"
  }
}
```

### **B. Collect Installment (Payment Lena)**
- **URL:** `{{base_url}}/api/installments/collect`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "customerId": "cust-uuid-123",
  "productId": "prod-uuid-789",
  "amountPaid": 8500,
  "paymentDate": "2023-11-15",
  "paymentMethod": "Cash"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Installment collected successfully.",
  "data": {
    "id": "pay-uuid-001",
    "productInstanceId": "prod-uuid-789",
    "amountPaid": 8500,
    "paymentDate": "2023-11-15T00:00:00.000Z",
    "paymentMethod": "Cash",
    "status": "Paid",
    "createdAt": "2023-11-15T12:00:00.000Z",
    "updatedAt": "2023-11-15T12:00:00.000Z"
  }
}
```

### **C. Get Installment History**
- **URL:** `{{base_url}}/api/installments/history/:productId`
- **Method:** `GET`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "pay-uuid-001",
      "amount": "8500.00",
      "date": "2023-11-15T00:00:00.000Z",
      "status": "Paid",
      "method": "Cash"
    }
  ]
}
```

---

## 4. Static Files
- Logos: `{{base_url}}/public/uploads/logos/<filename>`
- Customer Images: `{{base_url}}/public/uploads/customers/<filename>`
