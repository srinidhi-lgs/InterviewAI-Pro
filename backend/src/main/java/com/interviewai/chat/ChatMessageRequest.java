package com.interviewai.chat;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private String message;
    private String messageType; // Optional, defaults to TEXT
    private Boolean useResumeContext;
    private Boolean useProfileContext;
}
