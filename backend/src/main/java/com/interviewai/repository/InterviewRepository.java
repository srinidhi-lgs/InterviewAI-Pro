package com.interviewai.repository;

import com.interviewai.entity.Interview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, UUID> {
    Page<Interview> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    long countByUserId(UUID userId);
    
    long countByUserIdAndStatus(UUID userId, String status);
}
