package com.interviewai.repository;

import com.interviewai.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    Optional<Resume> findFirstByUserIdAndIsActiveTrueOrderByCreatedAtDesc(UUID userId);
    java.util.List<Resume> findByUserIdAndIsActiveTrue(UUID userId);
}
