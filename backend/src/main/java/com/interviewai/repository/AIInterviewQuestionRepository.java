package com.interviewai.repository;

import com.interviewai.entity.AIInterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AIInterviewQuestionRepository extends JpaRepository<AIInterviewQuestion, UUID> {
}
