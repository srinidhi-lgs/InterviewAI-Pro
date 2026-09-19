package com.interviewai.chat;

import java.util.List;

public interface AiProvider {
    /**
     * Generate a complete response synchronously.
     * @param context Context string (Resume/Profile details)
     * @param mode Selected AI mode
     * @param chatHistory List of previous messages in the session
     * @param userMessage The latest user message
     * @return Full text response
     */
    String generateResponse(String context, String mode, List<AiChatMessage> chatHistory, String userMessage);
    
    /**
     * Generate an auto-title for a chat session.
     * @param firstMessage The first message sent by the user
     * @return A concise title
     */
    String generateTitle(String firstMessage);

    /**
     * Direct one-off prompt execution with optional system instruction.
     * @param systemInstruction Instruction for the AI model
     * @param prompt The prompt message
     * @return The response text
     */
    String generateDirect(String systemInstruction, String prompt);
}
