# API Design
## AI Interview Platform

All APIs follow standard REST conventions. The base path for all endpoints is `/api/v1`.

### 1. Authentication Controller

#### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/register`
- **Request DTO**: 
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "userId": "uuid-1234"
  }
  ```
- **Error Response (400 Bad Request)**: e.g., Email already exists.

#### 1.2 Login
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/login`
- **Request DTO**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhb...",
    "expiresIn": 3600,
    "user": { "id": "uuid", "role": "ROLE_CANDIDATE" }
  }
  ```
  *(Refresh Token is sent as an HttpOnly cookie)*

#### 1.3 Refresh Token
- **Method**: `POST`
- **Endpoint**: `/api/v1/auth/refresh`
- **Success Response (200 OK)**: Returns new `accessToken`.

---

### 2. Resume Controller

#### 2.1 Upload Resume
- **Method**: `POST`
- **Endpoint**: `/api/v1/resumes`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Request**: Form Data containing PDF file.
- **Success Response (202 Accepted)**: Triggers async AI parsing.
  ```json
  { "resumeId": "uuid", "status": "ANALYSIS_PENDING" }
  ```

#### 2.2 Get Resume Analysis
- **Method**: `GET`
- **Endpoint**: `/api/v1/resumes/{resumeId}/analysis`
- **Success Response (200 OK)**:
  ```json
  {
    "skills": ["Java", "React"],
    "experienceYears": 5,
    "summary": "Full stack developer..."
  }
  ```

---

### 3. Interview Session Controller

#### 3.1 Start Interview
- **Method**: `POST`
- **Endpoint**: `/api/v1/interviews`
- **Request DTO**:
  ```json
  {
    "type": "TECHNICAL",
    "resumeId": "uuid"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "sessionId": "uuid",
    "firstQuestion": { "id": "uuid", "text": "Can you explain..." }
  }
  ```

#### 3.2 Submit Answer & Get Next Question
- **Method**: `POST`
- **Endpoint**: `/api/v1/interviews/{sessionId}/answers`
- **Request DTO**:
  ```json
  {
    "questionId": "uuid",
    "answerText": "I used Spring Boot because..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "nextQuestion": { "id": "uuid", "text": "What about..." },
    "isComplete": false
  }
  ```

#### 3.3 Get Interview Feedback
- **Method**: `GET`
- **Endpoint**: `/api/v1/interviews/{sessionId}/feedback`
- **Success Response (200 OK)**:
  ```json
  {
    "overallScore": 8.5,
    "strengths": "Strong core Java knowledge.",
    "improvements": "Need better understanding of concurrency.",
    "detailedReport": {}
  }
  ```

---

### 4. Coding Interview Controller

#### 4.1 Submit Code
- **Method**: `POST`
- **Endpoint**: `/api/v1/coding/{sessionId}/submit`
- **Request DTO**:
  ```json
  {
    "problemId": "uuid",
    "language": "JAVA",
    "code": "class Solution { ... }"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "passed": true,
    "passedCases": 10,
    "totalCases": 10,
    "executionTimeMs": 45
  }
  ```

---

### Common HTTP Status Codes
- `200 OK`: Request successful.
- `201 Created`: Resource successfully created.
- `202 Accepted`: Request accepted for asynchronous processing (e.g., AI Analysis).
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Invalid or missing JWT token.
- `403 Forbidden`: Insufficient role permissions.
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Server failure or AI provider timeout.
