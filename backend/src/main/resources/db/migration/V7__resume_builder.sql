-- V7__resume_builder.sql - AI Resume Builder Schema

CREATE TABLE IF NOT EXISTS builder_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    website VARCHAR(255),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    summary TEXT,
    theme_color VARCHAR(50) DEFAULT 'emerald',
    template_name VARCHAR(50) DEFAULT 'modern',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_builder_resumes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_builder_resumes_user_id ON builder_resumes(user_id);

CREATE TABLE IF NOT EXISTS builder_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current BOOLEAN DEFAULT false,
    gpa VARCHAR(50),
    description TEXT,
    order_index INTEGER DEFAULT 0,
    CONSTRAINT fk_builder_education_resume FOREIGN KEY (resume_id) REFERENCES builder_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS builder_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    CONSTRAINT fk_builder_experiences_resume FOREIGN KEY (resume_id) REFERENCES builder_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS builder_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255),
    technologies VARCHAR(500),
    order_index INTEGER DEFAULT 0,
    CONSTRAINT fk_builder_projects_resume FOREIGN KEY (resume_id) REFERENCES builder_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS builder_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    proficiency VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    CONSTRAINT fk_builder_skills_resume FOREIGN KEY (resume_id) REFERENCES builder_resumes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS builder_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    issue_date VARCHAR(50),
    url VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    CONSTRAINT fk_builder_certifications_resume FOREIGN KEY (resume_id) REFERENCES builder_resumes(id) ON DELETE CASCADE
);
