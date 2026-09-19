# Security Design
## AI Interview Platform

### 1. Authentication: JWT Flow
- **Stateless Architecture**: The backend will not store session state in memory. 
- **Access Tokens**: Short-lived JWTs (e.g., 15 minutes) signed with a strong secret key. Sent by the client in the `Authorization: Bearer <token>` header.
- **Refresh Token Flow**: Long-lived Refresh Tokens (e.g., 7 days) are stored in the database (`refresh_tokens` table) and sent to the client as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. When the Access Token expires, the frontend calls the `/refresh` endpoint, which reads the cookie, validates it against the DB, and issues a new Access Token.

### 2. Password Encryption
- **Algorithm**: BCrypt via Spring Security's `BCryptPasswordEncoder`.
- **Strength**: Configured with a work factor (strength) of 10 or 12.
- **Storage**: Plain text passwords will never be logged or stored.

### 3. Role-Based Access Control (RBAC)
- **Roles**: `ROLE_CANDIDATE` and `ROLE_ADMIN`.
- **Enforcement**: Method-level security using Spring Security's `@PreAuthorize("hasRole('ADMIN')")`.

### 4. API Authorization Rules
- `/api/v1/auth/**`: Public (PermitAll).
- `/api/v1/admin/**`: Restricted to `ROLE_ADMIN`.
- `/api/v1/users/**`, `/api/v1/resumes/**`, `/api/v1/interviews/**`: Restricted to authenticated users. Users can only access their own data (enforced by checking token ID against resource owner ID).

### 5. Input Validation
- **Backend (Spring Boot)**: `spring-boot-starter-validation` (Hibernate Validator) applied via `@Valid` on DTOs.
- **Frontend (Next.js)**: Zod schemas integrated with React Hook Form for strict client-side validation before submission.
- **File Upload Validation**: Strict checks on MIME type (`application/pdf` only) and file size (max 5MB) for resumes.

### 6. Global Exception Handling
- **Mechanism**: Spring `@ControllerAdvice` and `@ExceptionHandler`.
- **Behavior**: Catches exceptions and returns standardized JSON error responses containing the HTTP status, error message, and timestamp. Prevents stack traces from leaking to the client.

### 7. Audit Logging
- Implemented using Spring AOP or interceptors.
- Critical actions (Login, Password Change, Role Update, Resume Deletion) are recorded in the `audit_logs` table.

### 8. Rate Limiting
- To prevent brute-force attacks and abuse of AI generation endpoints (which are costly).
- Implementation using Bucket4j or Redis-based rate limiting per user/IP.

### 9. CORS (Cross-Origin Resource Sharing)
- Configured globally in Spring Security.
- Allows requests only from the trusted frontend domain (e.g., `http://localhost:3000` for dev, `https://interviewai.example.com` for prod).
- Allows specific methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) and headers.

### 10. Web Security Protections
- **SQL Injection**: Prevented by exclusively using Spring Data JPA and parameterized queries.
- **XSS (Cross-Site Scripting)**: Handled by React's default escaping in the frontend. Output sanitization applied if raw HTML rendering is ever required.
- **CSRF**: Disabled for REST APIs since JWTs and custom headers are used, but strict SameSite policies apply to the refresh token cookie.
