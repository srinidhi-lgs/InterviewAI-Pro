package com.interviewai.chat;

import java.util.List;
import java.util.UUID;

public interface AiChatService {
    ChatSessionResponse createSession(UUID userId, ChatSessionRequest request);
    List<ChatSessionResponse> getUserSessions(UUID userId);
    ChatSessionResponse getSession(UUID userId, UUID sessionId);
    void deleteSession(UUID userId, UUID sessionId);
    ChatSessionResponse renameSession(UUID userId, UUID sessionId, String newTitle);
    ChatSessionResponse pinSession(UUID userId, UUID sessionId, boolean isPinned);
    List<ChatSessionResponse> searchSessions(UUID userId, String keyword);
    void clearSession(UUID userId, UUID sessionId);
    
    ChatMessageResponse sendMessage(UUID userId, UUID sessionId, ChatMessageRequest request);
    List<ChatMessageResponse> getSessionMessages(UUID userId, UUID sessionId);
}
