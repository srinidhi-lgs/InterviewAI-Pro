package com.interviewai.repository;

import com.interviewai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = {"userRoles", "userRoles.role"})
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
