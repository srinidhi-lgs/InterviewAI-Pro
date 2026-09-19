-- V5__resume_advanced_analysis.sql - Advanced Resume Analysis Schema

CREATE TABLE IF NOT EXISTS resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL UNIQUE,
    job_description TEXT,
    
    -- Extracted info
    candidate_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    education TEXT,
    experience_text TEXT,
    projects_text TEXT,
    certifications_text TEXT,
    
    -- Statistics & Scores
    ats_score INTEGER NOT NULL DEFAULT 0,
    grammar_score INTEGER NOT NULL DEFAULT 0,
    formatting_score INTEGER NOT NULL DEFAULT 0,
    keyword_match_score INTEGER NOT NULL DEFAULT 0,
    completeness_score INTEGER NOT NULL DEFAULT 0,
    job_match_percentage INTEGER NOT NULL DEFAULT 0,
    
    experience_years INTEGER NOT NULL DEFAULT 0,
    projects_count INTEGER NOT NULL DEFAULT 0,
    certificates_count INTEGER NOT NULL DEFAULT 0,
    
    -- JSON Data
    technical_skills TEXT,
    soft_skills TEXT,
    tools TEXT,
    frameworks TEXT,
    databases TEXT,
    cloud TEXT,
    
    matched_keywords TEXT,
    missing_keywords TEXT,
    missing_skills TEXT,
    matched_skills TEXT,
    
    missing_sections TEXT,
    suggestions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_resume_analyses_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_resume_id ON resume_analyses(resume_id);
