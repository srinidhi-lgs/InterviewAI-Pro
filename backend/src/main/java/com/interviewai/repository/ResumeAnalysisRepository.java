package com.interviewai.repository;

import com.interviewai.entity.ResumeAnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysisEntity, UUID> {
    Optional<ResumeAnalysisEntity> findByResumeId(UUID resumeId);
}
