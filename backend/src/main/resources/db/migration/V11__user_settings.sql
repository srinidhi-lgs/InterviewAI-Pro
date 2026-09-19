CREATE TABLE user_settings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    theme VARCHAR(50) DEFAULT 'system',
    
    ai_model VARCHAR(100) DEFAULT 'gemini-2.5-flash',
    ai_tone VARCHAR(50) DEFAULT 'professional',
    response_length VARCHAR(50) DEFAULT 'medium',
    default_interview_difficulty VARCHAR(50) DEFAULT 'medium',
    preferred_language VARCHAR(50) DEFAULT 'English',
    
    email_notifications BOOLEAN DEFAULT true,
    interview_reminders BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    product_updates BOOLEAN DEFAULT false,
    
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
