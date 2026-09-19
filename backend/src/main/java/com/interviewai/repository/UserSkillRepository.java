package com.interviewai.repository;

import com.interviewai.entity.UserSkill;
import com.interviewai.entity.UserSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, UserSkillId> {
    List<UserSkill> findByUserId(UUID userId);
    Optional<UserSkill> findByUserIdAndSkillId(UUID userId, UUID skillId);
    boolean existsByUserIdAndSkillId(UUID userId, UUID skillId);
}
