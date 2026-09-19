-- V6__mock_interviews.sql - AI Mock Interviews Schema

CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    num_questions INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_interviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);

CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL,
    question_order INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    expected_keywords TEXT,
    sample_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_interview_questions_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    UNIQUE (interview_id, question_order)
);

CREATE TABLE IF NOT EXISTS interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL UNIQUE,
    user_answer TEXT NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_interview_answers_question FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interview_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL UNIQUE,
    overall_score INTEGER NOT NULL,
    technical_score INTEGER NOT NULL,
    communication_score INTEGER NOT NULL,
    strengths TEXT,
    weaknesses TEXT,
    suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_interview_results_interview FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
);
