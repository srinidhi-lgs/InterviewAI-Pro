package com.interviewai.chat;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class ChatSessionResponse {
    private UUID id;
    private String title;
    private String chatMode;
    private Boolean isPinned;
    private Instant createdAt;
    private Instant updatedAt;
}
