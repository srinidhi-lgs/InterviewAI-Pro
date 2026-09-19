# Development Roadmap
## AI Interview Platform

### Phase 1 - Authentication
- Configure Spring Security with JWT.
- Implement User Registration, Login, and Refresh Token logic.
- Build Next.js Auth pages (Login, Register).
- Integrate Zustand for client-side session state.

### Phase 2 - User Profile
- Design user profile schemas.
- Build APIs for updating personal info and viewing history.
- Create Frontend profile management screens.

### Phase 3 - Resume Module
- Implement file upload API with size/MIME validation.
- Configure AWS S3 (or local blob storage for dev).
- Build the Resume Manager UI (upload, view list, delete).

### Phase 4 - AI Resume Analysis
- Integrate AI provider (OpenAI/Gemini).
- Develop prompts to parse PDFs into structured JSON (skills, experience).
- Build background worker for async parsing.
- Display parsed skill profile on the frontend.

### Phase 5 - Interview Engine
- Build generic `Interview Session` state machine (Start, Answer, Next).
- Implement HR Interview mode (behavioral prompts).
- Implement Technical Interview mode (fetching questions based on parsed skills).
- Develop Frontend real-time interview interface (Chat/Voice recording).

### Phase 6 - Coding Module
- Develop the Code Execution Environment (sandboxed or third-party API like Judge0).
- Create `coding_problems` seeding mechanism.
- Implement the Frontend Code Editor using Monaco Editor.
- Handle real-time submission evaluation.

### Phase 7 - AI Feedback
- Create aggregation prompt to analyze the entire session's Q&A.
- Generate overall score, strengths, and improvement matrix.
- Design Frontend Feedback Report visualization (charts, scorecards).

### Phase 8 - Dashboard Analytics
- Implement aggregate queries for user progress.
- Build Admin dashboard APIs for system metrics.
- Design Frontend charts using Recharts/Chart.js.

### Phase 9 - Notifications
- Implement basic notification system (unread flags).
- (Optional) WebSocket integration for real-time alerts.

### Phase 10 - Testing
- Write JUnit/Mockito unit tests for core backend services.
- Write Integration tests for repositories.
- Setup Cypress/Playwright for Frontend End-to-End testing.

### Phase 11 - Docker
- Write `Dockerfile` for Spring Boot (multi-stage Maven build).
- Write `Dockerfile` for Next.js (standalone build).
- Create `docker-compose.yml` to orchestrate Postgres, Backend, and Frontend locally.

### Phase 12 - AWS Deployment
- Provision RDS (PostgreSQL).
- Setup ECR for Docker images.
- Deploy to AWS ECS (Fargate) or EC2.
- Configure ALB (Application Load Balancer) and Route53 for domains.
