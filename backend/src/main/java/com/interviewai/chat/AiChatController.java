package com.interviewai.chat;

import com.interviewai.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;
    private final com.interviewai.security.CurrentUserService currentUserService;

    @PostMapping("/session")
    public ResponseEntity<ChatSessionResponse> createSession(
            @RequestBody(required = false) ChatSessionRequest request) {
        if (request == null) {
            request = new ChatSessionRequest();
        }
        return ResponseEntity.ok(aiChatService.createSession(currentUserService.getCurrentUser().getId(), request));
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSessionResponse>> getSessions() {
        return ResponseEntity.ok(aiChatService.getUserSessions(currentUserService.getCurrentUser().getId()));
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<ChatSessionResponse> getSession(
            @PathVariable UUID id) {
        return ResponseEntity.ok(aiChatService.getSession(currentUserService.getCurrentUser().getId(), id));
    }
    
    @GetMapping("/session/{id}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getSessionMessages(
            @PathVariable UUID id) {
        return ResponseEntity.ok(aiChatService.getSessionMessages(currentUserService.getCurrentUser().getId(), id));
    }

    @PostMapping("/session/{id}/message")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable UUID id,
            @RequestBody ChatMessageRequest request) {
        return ResponseEntity.ok(aiChatService.sendMessage(currentUserService.getCurrentUser().getId(), id, request));
    }

    @DeleteMapping("/session/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable UUID id) {
        aiChatService.deleteSession(currentUserService.getCurrentUser().getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/session/{id}/rename")
    public ResponseEntity<ChatSessionResponse> renameSession(
            @PathVariable UUID id,
            @RequestParam String title) {
        return ResponseEntity.ok(aiChatService.renameSession(currentUserService.getCurrentUser().getId(), id, title));
    }

    @PutMapping("/session/{id}/pin")
    public ResponseEntity<ChatSessionResponse> pinSession(
            @PathVariable UUID id,
            @RequestParam boolean isPinned) {
        return ResponseEntity.ok(aiChatService.pinSession(currentUserService.getCurrentUser().getId(), id, isPinned));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ChatSessionResponse>> searchSessions(
            @RequestParam String keyword) {
        return ResponseEntity.ok(aiChatService.searchSessions(currentUserService.getCurrentUser().getId(), keyword));
    }

    @PostMapping("/session/{id}/clear")
    public ResponseEntity<Void> clearSession(
            @PathVariable UUID id) {
        aiChatService.clearSession(currentUserService.getCurrentUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}
