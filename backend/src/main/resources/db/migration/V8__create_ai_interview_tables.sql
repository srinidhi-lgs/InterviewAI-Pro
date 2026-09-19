CREATE TABLE IF NOT EXISTS ai_interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    experience_level VARCHAR(50) NOT NULL,
    interview_type VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    num_questions INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    score INTEGER,
    feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_ai_interview_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    question_order INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50),
    question_text TEXT NOT NULL,
    expected_answer TEXT,
    user_answer TEXT,
    time_taken INTEGER,
    score INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_ai_interview_questions_session FOREIGN KEY (session_id) REFERENCES ai_interview_sessions(id) ON DELETE CASCADE,
    UNIQUE (session_id, question_order)
);

