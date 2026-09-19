# Software Requirements Specification (SRS)
## AI Interview Platform

### 1. Introduction
The AI Interview Platform is a comprehensive web-based application designed to streamline the technical screening and interviewing process. It uses advanced AI to analyze resumes, conduct interviews (HR, Technical, and Coding), and provide detailed feedback.

### 2. User Roles
- **Candidate**: A user seeking to practice or take interviews. They can upload resumes, participate in interviews, and view their feedback/history.
- **Admin**: An administrator who manages the platform, views analytics, and oversees user accounts.

### 3. Functional Requirements

#### 3.1 Authentication & Authorization
- **Registration**: Users can create an account using email and password.
- **Login**: Secure login using JWT (JSON Web Tokens).
- **Role-Based Access**: Access control based on Candidate and Admin roles.

#### 3.2 Resume Management
- **Upload**: Candidates can upload their resumes in PDF format.
- **AI Analysis**: The platform parses the resume to extract skills, experience, and education using AI.
- **Management**: Candidates can view, update, and manage multiple versions of their resumes.

#### 3.3 Interview Engine
- **Session Management**: Ability to start, pause, and resume interview sessions.
- **HR Interview**: AI-driven behavioral and situational questions based on the candidate's profile.
- **Technical Interview**: Deep-dive technical questions based on the candidate's extracted skills and resume.
- **Coding Interview**: Real-time coding challenges with a built-in code editor and compiler.

#### 3.4 AI Layer
- **Dynamic Question Generation**: AI generates follow-up questions based on real-time candidate answers.
- **Answer Evaluation**: AI evaluates the correctness, confidence, and structure of answers.
- **Feedback**: Comprehensive feedback provided after the interview, including strengths, weaknesses, and improvement areas.

#### 3.5 Dashboard & Analytics
- **Candidate Dashboard**: Overview of past interviews, average scores, and upcoming recommended modules.
- **Admin Dashboard**: System-wide metrics, active sessions, and user statistics.

#### 3.6 User Profiles & Skills
- **Profile Management**: Users can update personal details and preferences.
- **Skills Management**: System tracks verified skills based on resume analysis and interview performance.

#### 3.7 Notifications
- **In-App Alerts**: Notifications for completed AI feedback, system updates, and reminders.

### 4. Non-Functional Requirements
- **Performance**: API response times should be under 200ms for non-AI requests.
- **Scalability**: Architecture must support horizontal scaling for both frontend and backend.
- **Security**: Passwords must be hashed using BCrypt. All endpoints must be secured.
- **Reliability**: The system must maintain 99.9% uptime.
- **Compatibility**: The frontend must be fully responsive and support modern browsers.
