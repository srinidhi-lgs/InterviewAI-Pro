package com.interviewai.repository;

import com.interviewai.entity.BuilderResume;
import com.interviewai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuilderResumeRepository extends JpaRepository<BuilderResume, UUID> {
    List<BuilderResume> findByUserOrderByUpdatedAtDesc(User user);
    Optional<BuilderResume> findByIdAndUser(UUID id, User user);
    long countByUser(User user);
}
