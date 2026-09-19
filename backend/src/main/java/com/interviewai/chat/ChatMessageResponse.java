package com.interviewai.chat;

import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
public class ChatMessageResponse {
    private UUID id;
    private UUID sessionId;
    private ChatSender sender;
    private String message;
    private MessageType messageType;
    private Instant createdAt;
}
