package com.interviewai.repository;

import com.interviewai.entity.AIInterviewSession;
import com.interviewai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AIInterviewSessionRepository extends JpaRepository<AIInterviewSession, UUID> {
    Page<AIInterviewSession> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
