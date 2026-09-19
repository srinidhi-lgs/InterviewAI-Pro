# Database Design
## AI Interview Platform

### Global Considerations
- **Normalization**: Schema follows 3rd Normal Form (3NF) to eliminate redundancy.
- **Scalability**: UUIDs are used for primary keys to support distributed database sharding in the future. Soft deletes (`is_deleted` flags) are favored over hard deletes.
- **Auditability**: Every table includes `created_at` and `updated_at` timestamps.

---

### 1. `users`
**Purpose**: Stores core user authentication and identification data.
- **Columns**: 
  - `id` (UUID)
  - `email` (VARCHAR, UNIQUE, NOT NULL)
  - `password_hash` (VARCHAR, NOT NULL)
  - `is_active` (BOOLEAN, DEFAULT TRUE)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- **Primary Key**: `id`
- **Indexes**: `idx_users_email` (email)

### 2. `roles`
**Purpose**: Defines system roles (e.g., ROLE_CANDIDATE, ROLE_ADMIN).
- **Columns**: 
  - `id` (UUID)
  - `name` (VARCHAR, UNIQUE, NOT NULL)
- **Primary Key**: `id`

### 3. `user_roles`
**Purpose**: Junction table for Many-to-Many relationship between users and roles.
- **Columns**:
  - `user_id` (UUID)
  - `role_id` (UUID)
- **Primary Key**: Composite (`user_id`, `role_id`)
- **Foreign Keys**: `user_id` -> `users.id`, `role_id` -> `roles.id`

### 4. `user_profiles`
**Purpose**: Stores extended personal information for a user.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID, UNIQUE)
  - `first_name` (VARCHAR)
  - `last_name` (VARCHAR)
  - `phone_number` (VARCHAR)
  - `linkedin_url` (VARCHAR)
  - `github_url` (VARCHAR)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`
- **Relationships**: One-to-One with `users`.

### 5. `skills`
**Purpose**: Master dictionary of all available technical and soft skills.
- **Columns**:
  - `id` (UUID)
  - `name` (VARCHAR, UNIQUE, NOT NULL)
  - `category` (VARCHAR) -- e.g., 'LANGUAGE', 'FRAMEWORK'
- **Primary Key**: `id`
- **Indexes**: `idx_skills_name` (name)

### 6. `user_skills`
**Purpose**: Junction table associating users with skills, including proficiency.
- **Columns**:
  - `user_id` (UUID)
  - `skill_id` (UUID)
  - `proficiency_level` (VARCHAR) -- e.g., 'BEGINNER', 'EXPERT'
- **Primary Key**: Composite (`user_id`, `skill_id`)
- **Foreign Keys**: `user_id` -> `users.id`, `skill_id` -> `skills.id`

### 7. `resumes`
**Purpose**: Metadata for uploaded resumes. Enhanced with versioning support.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `file_name` (VARCHAR)
  - `file_url` (VARCHAR) -- S3 bucket URL
  - `version` (INTEGER, DEFAULT 1)
  - `is_active` (BOOLEAN, DEFAULT TRUE)
  - `uploaded_at` (TIMESTAMP)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`
- **Constraints**: UNIQUE(`user_id`, `file_name`, `version`)
- **Indexes**: `idx_resumes_user_active` (user_id, is_active)

### 8. `resume_analysis`
**Purpose**: Stores the structured JSON output and scoring from the AI resume parser.
- **Columns**:
  - `id` (UUID)
  - `resume_id` (UUID, UNIQUE)
  - `parsed_data` (JSONB)
  - `overall_score` (DECIMAL) -- ATS Compatibility Score
  - `technical_score` (DECIMAL)
  - `experience_score` (DECIMAL)
  - `analysis_status` (VARCHAR) -- e.g., 'PENDING', 'COMPLETED'
- **Primary Key**: `id`
- **Foreign Keys**: `resume_id` -> `resumes.id`
- **Relationships**: One-to-One with `resumes`.

### 9. `interview_sessions`
**Purpose**: Represents an instance of an interview. Highly reusable.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `resume_id` (UUID, NULLABLE) -- Optional context for the interview
  - `interview_type` (VARCHAR) -- 'HR', 'TECHNICAL', 'CODING'
  - `status` (VARCHAR) -- 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'
  - `started_at` (TIMESTAMP)
  - `completed_at` (TIMESTAMP)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`, `resume_id` -> `resumes.id`
- **Indexes**: `idx_session_user` (user_id)

### 10. `interview_questions`
**Purpose**: Questions asked during a specific interview session.
- **Columns**:
  - `id` (UUID)
  - `session_id` (UUID)
  - `question_text` (TEXT)
  - `question_order` (INTEGER)
  - `expected_answer_hints` (TEXT)
- **Primary Key**: `id`
- **Foreign Keys**: `session_id` -> `interview_sessions.id`

### 11. `interview_answers`
**Purpose**: The candidate's response to an interview question.
- **Columns**:
  - `id` (UUID)
  - `question_id` (UUID, UNIQUE)
  - `answer_text` (TEXT)
  - `audio_url` (VARCHAR, NULLABLE)
  - `ai_score` (DECIMAL)
  - `ai_feedback` (TEXT)
- **Primary Key**: `id`
- **Foreign Keys**: `question_id` -> `interview_questions.id`
- **Relationships**: One-to-One with `interview_questions`.

### 12. `coding_problems`
**Purpose**: Master list of coding challenges.
- **Columns**:
  - `id` (UUID)
  - `title` (VARCHAR)
  - `description` (TEXT)
  - `difficulty` (VARCHAR)
  - `initial_code` (TEXT)
  - `test_cases` (JSONB)
- **Primary Key**: `id`

### 13. `coding_submissions`
**Purpose**: Code submitted by the candidate during a coding interview.
- **Columns**:
  - `id` (UUID)
  - `session_id` (UUID)
  - `problem_id` (UUID)
  - `submitted_code` (TEXT)
  - `language` (VARCHAR)
  - `execution_time_ms` (INTEGER)
  - `passed_test_cases` (INTEGER)
  - `total_test_cases` (INTEGER)
- **Primary Key**: `id`
- **Foreign Keys**: `session_id` -> `interview_sessions.id`, `problem_id` -> `coding_problems.id`

### 14. `interview_feedback`
**Purpose**: Final aggregated AI feedback for a completed interview session.
- **Columns**:
  - `id` (UUID)
  - `session_id` (UUID, UNIQUE)
  - `overall_score` (DECIMAL)
  - `technical_score` (DECIMAL)
  - `communication_score` (DECIMAL)
  - `problem_solving_score` (DECIMAL)
  - `hire_recommendation` (VARCHAR) -- e.g., 'STRONG_HIRE', 'HIRE', 'NO_HIRE'
  - `strengths` (TEXT)
  - `improvements` (TEXT)
  - `detailed_report` (JSONB)
- **Primary Key**: `id`
- **Foreign Keys**: `session_id` -> `interview_sessions.id`
- **Relationships**: One-to-One with `interview_sessions`.

### 15. `notifications`
**Purpose**: Alerts and messages sent to users.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `title` (VARCHAR)
  - `message` (TEXT)
  - `is_read` (BOOLEAN, DEFAULT FALSE)
  - `created_at` (TIMESTAMP)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`
- **Indexes**: `idx_notif_user_read` (user_id, is_read)

### 16. `audit_logs`
**Purpose**: Security and compliance tracking for sensitive actions.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID, NULLABLE)
  - `action` (VARCHAR)
  - `entity_type` (VARCHAR)
  - `entity_id` (VARCHAR)
  - `ip_address` (VARCHAR)
  - `timestamp` (TIMESTAMP)
- **Primary Key**: `id`

### 17. `refresh_tokens`
**Purpose**: Manages long-lived JWT refresh tokens for secure sessions.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `token` (VARCHAR, UNIQUE, NOT NULL)
  - `expires_at` (TIMESTAMP, NOT NULL)
  - `is_revoked` (BOOLEAN, DEFAULT FALSE)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`
- **Indexes**: `idx_refresh_tokens_token` (token)

### 18. `interview_templates`
**Purpose**: Predefined configurations and flows for starting standardized interviews.
- **Columns**:
  - `id` (UUID)
  - `name` (VARCHAR, UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `interview_type` (VARCHAR) -- 'HR', 'TECHNICAL', 'CODING'
  - `duration_minutes` (INTEGER)
  - `config_json` (JSONB) -- Config parameters (tags, difficulty)
- **Primary Key**: `id`

### 19. `ai_models`
**Purpose**: Registry of available AI models (OpenAI, Gemini) for versioning and fallback routing.
- **Columns**:
  - `id` (UUID)
  - `provider` (VARCHAR) -- 'OPENAI', 'GOOGLE'
  - `model_name` (VARCHAR, UNIQUE, NOT NULL)
  - `is_active` (BOOLEAN, DEFAULT TRUE)
  - `priority` (INTEGER)
- **Primary Key**: `id`

### 20. `user_sessions`
**Purpose**: Tracks active authenticated sessions and complete login history.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `device_info` (VARCHAR)
  - `ip_address` (VARCHAR)
  - `login_time` (TIMESTAMP)
  - `logout_time` (TIMESTAMP, NULLABLE)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`

### 21. `ai_chat_history`
**Purpose**: Logs intermediate conversational history and reasoning traces with the AI agent.
- **Columns**:
  - `id` (UUID)
  - `session_id` (UUID)
  - `role` (VARCHAR) -- 'SYSTEM', 'USER', 'ASSISTANT'
  - `content` (TEXT)
  - `timestamp` (TIMESTAMP)
- **Primary Key**: `id`
- **Foreign Keys**: `session_id` -> `interview_sessions.id`
- **Indexes**: `idx_chat_hist_session` (session_id)

### 22. `learning_roadmaps`
**Purpose**: Stores AI-generated, customized post-interview learning paths.
- **Columns**:
  - `id` (UUID)
  - `user_id` (UUID)
  - `feedback_id` (UUID)
  - `title` (VARCHAR)
  - `roadmap_json` (JSONB) -- Structured steps and resources
  - `status` (VARCHAR) -- 'IN_PROGRESS', 'COMPLETED'
  - `created_at` (TIMESTAMP)
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users.id`, `feedback_id` -> `interview_feedback.id`
