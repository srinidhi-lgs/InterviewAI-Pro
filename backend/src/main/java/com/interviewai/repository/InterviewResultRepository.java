package com.interviewai.repository;

import com.interviewai.entity.InterviewResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewResultRepository extends JpaRepository<InterviewResult, UUID> {
    Optional<InterviewResult> findByInterviewId(UUID interviewId);
    
    @org.springframework.data.jpa.repository.Query("SELECT r FROM InterviewResult r WHERE r.interview.user.id = :userId")
    java.util.List<InterviewResult> findAllByUserId(@org.springframework.data.repository.query.Param("userId") UUID userId);
}
