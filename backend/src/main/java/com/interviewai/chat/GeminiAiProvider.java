package com.interviewai.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiAiProvider implements AiProvider {

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    private static final Logger logger = LoggerFactory.getLogger(GeminiAiProvider.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=";

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("AIzaSyYourActualGeminiApiKeyHere")) {
            throw new IllegalStateException("Gemini API Key is not configured correctly! Please set the GEMINI_API_KEY environment variable.");
        }
        String maskedKey = apiKey.length() > 6 ? apiKey.substring(0, 6) + "******" : "******";
        logger.info("Gemini API Key Loaded: {}", maskedKey);
    }

    @Override
    public String generateResponse(String context, String mode, List<AiChatMessage> chatHistory, String userMessage) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "Error: Gemini API Key is not configured. Please add ai.gemini.api-key to application.properties.";
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();

            // Build system instructions based on mode
            String systemInstruction = buildSystemPrompt(mode, context);
            
            Map<String, Object> systemInstructionNode = new HashMap<>();
            systemInstructionNode.put("parts", List.of(Map.of("text", systemInstruction)));
            requestBody.put("system_instruction", systemInstructionNode);

            // Build chat history contents
            List<Map<String, Object>> contents = new ArrayList<>();
            for (AiChatMessage msg : chatHistory) {
                Map<String, Object> content = new HashMap<>();
                content.put("role", msg.getSender() == ChatSender.USER ? "user" : "model");
                content.put("parts", List.of(Map.of("text", msg.getMessage())));
                contents.add(content);
            }

            requestBody.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            String url = GEMINI_API_URL + apiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                if (content != null && !content.isMissingNode()) {
                    JsonNode parts = content.path("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode text = parts.get(0).path("text");
                        if (text != null && !text.isMissingNode()) {
                            return text.asText();
                        }
                    }
                }
            }
            return "Sorry, I couldn't generate a response. The API returned an unexpected format.";

        } catch (HttpClientErrorException e) {
            logger.error("HTTP Error from Gemini API: {} - Response: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            if (e.getStatusCode().value() == 429) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Gemini API rate limit exceeded");
            }
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Gemini API Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            logger.error("Failed to call Gemini API", e);
            if (e instanceof ResponseStatusException) {
                throw (ResponseStatusException) e;
            }
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Failed to call external AI provider: " + e.getMessage());
        }
    }

    @Override
    public String generateTitle(String firstMessage) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "New Chat";
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> systemInstructionNode = new HashMap<>();
            systemInstructionNode.put("parts", List.of(Map.of("text", "You are a title generator. Generate a concise 3-4 word title for this chat based on the user's first message. Do not use quotes or punctuation.")));
            requestBody.put("system_instruction", systemInstructionNode);

            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            content.put("role", "user");
            content.put("parts", List.of(Map.of("text", firstMessage)));
            contents.add(content);

            requestBody.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            String url = GEMINI_API_URL + apiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode contentNode = candidates.get(0).path("content");
                if (contentNode != null && !contentNode.isMissingNode()) {
                    JsonNode parts = contentNode.path("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode text = parts.get(0).path("text");
                        if (text != null && !text.isMissingNode()) {
                            return text.asText().trim();
                        }
                    }
                }
            }

            return "New Chat";

        } catch (HttpClientErrorException e) {
            logger.error("HTTP Error from Gemini API generating title: {} - Response: {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            return "New Chat";
        } catch (Exception e) {
            logger.error("Failed to call Gemini API for title generation", e);
            return "New Chat";
        }
    }

    @Override
    public String generateDirect(String systemInstruction, String prompt) {
        if (apiKey == null || apiKey.isEmpty()) {
            return null;
        }

        int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                Map<String, Object> requestBody = new HashMap<>();

                if (systemInstruction != null && !systemInstruction.isBlank()) {
                    Map<String, Object> systemInstructionNode = new HashMap<>();
                    systemInstructionNode.put("parts", List.of(Map.of("text", systemInstruction)));
                    requestBody.put("system_instruction", systemInstructionNode);
                }

                List<Map<String, Object>> contents = new ArrayList<>();
                Map<String, Object> content = new HashMap<>();
                content.put("role", "user");
                content.put("parts", List.of(Map.of("text", prompt)));
                contents.add(content);

                requestBody.put("contents", contents);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

                String url = GEMINI_API_URL + apiKey;
                ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);

                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                    JsonNode contentNode = candidates.get(0).path("content");
                    if (contentNode != null && !contentNode.isMissingNode()) {
                        JsonNode parts = contentNode.path("parts");
                        if (parts != null && parts.isArray() && parts.size() > 0) {
                            JsonNode text = parts.get(0).path("text");
                            if (text != null && !text.isMissingNode()) {
                                return text.asText().trim();
                            }
                        }
                    }
                }
                return null;
            } catch (Exception e) {
                logger.warn("Gemini API call attempt {} failed: {}", attempt, e.getMessage());
                if (attempt < maxAttempts) {
                    try {
                        Thread.sleep(1200);
                    } catch (InterruptedException ignored) {}
                } else {
                    logger.error("Failed to call Gemini API directly after {} attempts", maxAttempts, e);
                }
            }
        }
        return null;
    }

    private String buildSystemPrompt(String mode, String context) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are the InterviewAI Pro Copilot, a highly advanced AI assistant.\n");
        prompt.append("Current Mode: ").append(mode).append("\n\n");

        switch (mode) {
            case "Resume Expert":
            case "Resume Builder":
                prompt.append("You are an expert Resume Builder and ATS Reviewer.\n");
                prompt.append("Your goal is to:\n");
                prompt.append("- Analyze the stored profile and uploaded resume.\n");
                prompt.append("- Reuse existing information and only ask for missing info.\n");
                prompt.append("- Generate ATS-friendly resume content and suggest improvements.\n");
                prompt.append("- Format your output clearly using markdown.\n");
                break;
            case "Career Mentor":
            case "Placement Guide":
                prompt.append("You are a Career Mentor and Placement Guide.\n");
                prompt.append("Your goal is to:\n");
                prompt.append("- Recommend skills, projects, certifications, and job roles based on the user's profile.\n");
                prompt.append("- Provide a concrete learning roadmap tailored to the user.\n");
                break;
            case "Interview Coach":
                prompt.append("You are a strict but helpful Interview Coach.\n");
                prompt.append("Your goal is to:\n");
                prompt.append("- Ask realistic interview questions one by one.\n");
                prompt.append("- Evaluate the user's answers, provide detailed feedback, and suggest better ways to answer.\n");
                break;
            case "ATS Reviewer":
                prompt.append("You are an ATS (Applicant Tracking System) Reviewer.\n");
                prompt.append("Your goal is to:\n");
                prompt.append("- Analyze the resume and calculate a mock ATS score.\n");
                prompt.append("- Identify missing keywords and suggest stronger bullet points.\n");
                break;
            default:
                prompt.append("You are a helpful assistant for coding, placements, and resume building.\n");
                prompt.append("Answer questions clearly and concisely using Markdown.\n");
                break;
        }

        if (context != null && !context.isBlank()) {
            prompt.append("\n\nUser Context (Use this to personalize your response):\n").append(context);
        }

        return prompt.toString();
    }
}
