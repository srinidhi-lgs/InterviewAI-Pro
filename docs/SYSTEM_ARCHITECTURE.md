# System Architecture
## AI Interview Platform

### 1. High-Level Architecture Overview
The platform uses a decoupled, microservices-ready layered architecture with a clear separation between the presentation layer (Frontend) and the business logic layer (Backend). 

### 2. Frontend Layer
- **Framework**: Next.js 15 (App Router).
- **Language**: TypeScript for strict type-checking.
- **State Management**: Zustand for global state, React Query (TanStack Query) for server-state caching and async data fetching.
- **Styling**: Tailwind CSS combined with shadcn/ui for rapid, accessible component design.
- **Responsibility**: Handling UI/UX, routing, client-side validation, and managing real-time interview sessions (video/audio/code editor).

### 3. Backend Layer
- **Framework**: Spring Boot 3.5.x.
- **Language**: Java 21.
- **API Style**: RESTful architecture.
- **Responsibility**: Managing business logic, authentication, interview state machines, and serving as an orchestrator between the database and the AI layer.
- **Key Modules**:
  - `Security Module`: Manages JWT and RBAC.
  - `Interview Engine`: Core module managing HR, Technical, and Coding sessions.
  - `AI Orchestrator`: Interfaces with external AI providers.

### 4. Database Layer
- **Primary Database**: PostgreSQL (Relational Database).
- **ORM**: Spring Data JPA / Hibernate.
- **Migrations**: Flyway for version-controlled schema evolution.
- **Responsibility**: Persistent storage for users, resumes, interview history, questions, answers, and analytics data.

### 5. AI Layer Architecture
The AI layer is designed as an abstracted interface within the backend to support multiple AI providers (e.g., OpenAI, Gemini, Claude).
- **Resume Parsing Engine**: Extracts unstructured text from PDFs and maps it to structured JSON (Skills, Experience).
- **Question Generator Agent**: Given a resume and job context, generates tailored interview questions.
- **Answer Evaluator Agent**: Scores real-time user answers against ideal responses.
- **Feedback Generator**: Aggregates all evaluations to generate comprehensive feedback reports.
- **Extensibility**: Implements the Strategy Pattern in Java to swap AI providers seamlessly.

### 6. File Storage
- **Current Setup**: Local storage / Database BLOBS for initial phases.
- **Target Architecture**: Amazon S3 (or compatible object storage like MinIO) for storing parsed resumes, profile pictures, and potential video/audio interview recordings. Pre-signed URLs will be used to securely serve files to the frontend.

### 7. Authentication Flow
- **Mechanism**: Stateless JWT (JSON Web Tokens).
- **Flow**: Client requests login -> Backend verifies credentials via DB -> Backend issues Access Token and Refresh Token -> Client stores Access Token in memory/secure storage and Refresh Token in HttpOnly cookie.

### 8. Future Cloud Deployment
- **Containerization**: Both Frontend and Backend will be dockerized (`Dockerfile`).
- **Orchestration**: Kubernetes (Amazon EKS) or Amazon ECS for managing container instances and auto-scaling.
- **CI/CD**: GitHub Actions for automated testing and deployment.
- **Proxy/Gateway**: Nginx or AWS API Gateway for load balancing, rate limiting, and SSL termination.
