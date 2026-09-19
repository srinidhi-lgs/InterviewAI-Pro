package com.interviewai.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiChatSessionRepository extends JpaRepository<AiChatSession, UUID> {
    List<AiChatSession> findAllByUserIdOrderByUpdatedAtDesc(UUID userId);
    
    @Query("SELECT DISTINCT s FROM AiChatSession s LEFT JOIN AiChatMessage m ON s.id = m.session.id " +
           "WHERE s.user.id = :userId AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.message) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<AiChatSession> searchSessionsByKeyword(@Param("userId") UUID userId, @Param("keyword") String keyword);
}
