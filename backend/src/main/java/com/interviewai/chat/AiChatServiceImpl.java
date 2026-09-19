package com.interviewai.chat;

import com.interviewai.entity.Resume;
import com.interviewai.entity.User;
import com.interviewai.entity.UserProfile;
import com.interviewai.repository.UserProfileRepository;
import com.interviewai.repository.ResumeRepository;
import com.interviewai.repository.UserRepository;
import com.interviewai.service.resume.ResumeParserService;
import com.interviewai.service.notification.NotificationService;
import com.interviewai.entity.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatServiceImpl implements AiChatService {

    private final AiChatSessionRepository sessionRepository;
    private final AiChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final UserProfileRepository profileRepository;
    private final ResumeParserService resumeParserService;
    private final AiProvider aiProvider;
    private final NotificationService notificationService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AiChatServiceImpl.class);

    @Override
    @Transactional
    public ChatSessionResponse createSession(UUID userId, ChatSessionRequest request) {
        try {
            logger.info("Attempting to create AI chat session for user: {}", userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
            
            String mode = (request != null && request.getChatMode() != null) ? request.getChatMode() : "Career Mentor";
            logger.debug("Using chat mode: {}", mode);
            
            AiChatSession session = AiChatSession.builder()
                    .user(user)
                    .title("New Chat")
                    .chatMode(mode)
                    .isPinned(false)
                    .build();
                    
            AiChatSession saved = sessionRepository.save(session);
            logger.info("Successfully created AI chat session with ID: {}", saved.getId());
            return mapToSessionResponse(saved);
        } catch (Exception e) {
            logger.error("Error creating AI chat session for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to create chat session: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionResponse> getUserSessions(UUID userId) {
        return sessionRepository.findAllByUserIdOrderByUpdatedAtDesc(userId)
                .stream().map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChatSessionResponse getSession(UUID userId, UUID sessionId) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        return mapToSessionResponse(session);
    }

    @Override
    @Transactional
    public void deleteSession(UUID userId, UUID sessionId) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        sessionRepository.delete(session);
    }

    @Override
    @Transactional
    public ChatSessionResponse renameSession(UUID userId, UUID sessionId, String newTitle) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        session.setTitle(newTitle);
        return mapToSessionResponse(sessionRepository.save(session));
    }

    @Override
    @Transactional
    public ChatSessionResponse pinSession(UUID userId, UUID sessionId, boolean isPinned) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        session.setIsPinned(isPinned);
        return mapToSessionResponse(sessionRepository.save(session));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionResponse> searchSessions(UUID userId, String keyword) {
        return sessionRepository.searchSessionsByKeyword(userId, keyword)
                .stream().map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void clearSession(UUID userId, UUID sessionId) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        messageRepository.deleteAllBySessionId(sessionId);
    }

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(UUID userId, UUID sessionId, ChatMessageRequest request) {
        AiChatSession session = getAndValidateSession(userId, sessionId);
        
        // Save user message
        AiChatMessage userMessage = AiChatMessage.builder()
                .session(session)
                .sender(ChatSender.USER)
                .message(request.getMessage())
                .messageType(request.getMessageType() != null ? MessageType.valueOf(request.getMessageType()) : MessageType.TEXT)
                .build();
        messageRepository.save(userMessage);
        
        // Auto-title if it's the first message
        if ("New Chat".equals(session.getTitle())) {
            session.setTitle(aiProvider.generateTitle(request.getMessage()));
            sessionRepository.save(session);
        }
        
        boolean isAtsRequest = false;
        
        // Fetch context if requested
        StringBuilder contextBuilder = new StringBuilder();
        if (Boolean.TRUE.equals(request.getUseProfileContext())) {
            profileRepository.findByUserId(userId).ifPresent(profile -> {
                contextBuilder.append("User Profile Context:\n");
                contextBuilder.append("Name: ").append(profile.getFullName()).append("\n");
                contextBuilder.append("Skills: ").append(profile.getSkills()).append("\n");
                contextBuilder.append("College: ").append(profile.getCollege()).append("\n");
                contextBuilder.append("CGPA: ").append(profile.getCgpa()).append("\n");
                contextBuilder.append("Bio: ").append(profile.getBio()).append("\n\n");
            });
        }
        
        if (Boolean.TRUE.equals(request.getUseResumeContext())) {
            java.util.Optional<Resume> activeResume = resumeRepository.findByUserIdAndIsActiveTrue(userId).stream().findFirst();
            if (activeResume.isEmpty()) {
                AiChatMessage aiMessage = AiChatMessage.builder()
                        .session(session)
                        .sender(ChatSender.AI)
                        .message("I couldn't find a resume associated with your account. Please upload your resume first, then try again.")
                        .messageType(MessageType.TEXT)
                        .tokensUsed(0)
                        .modelName("gemini-flash-latest")
                        .responseTimeMs(0L)
                        .build();
                AiChatMessage savedAiMessage = messageRepository.save(aiMessage);
                session.setUpdatedAt(savedAiMessage.getCreatedAt());
                sessionRepository.save(session);
                return mapToMessageResponse(savedAiMessage);
            }
            
            Resume resume = activeResume.get();
            try (java.io.InputStream is = java.nio.file.Files.newInputStream(java.nio.file.Paths.get(resume.getFilePath()))) {
                String resumeText = resumeParserService.extractTextFromPDF(is);
                if (resumeText == null || resumeText.isEmpty()) {
                    throw new Exception("Empty extraction");
                }
                
                if (request.getMessage().toLowerCase().contains("ats") || "Resume Expert".equalsIgnoreCase(session.getChatMode())) {
                    contextBuilder.append("You are an ATS resume reviewer.\n\n");
                    contextBuilder.append("Analyze the candidate's actual resume provided below.\n\n");
                    contextBuilder.append("Do NOT ask the user to paste their resume.\n");
                    contextBuilder.append("Do NOT say that you cannot access their resume.\n");
                    contextBuilder.append("Do NOT invent resume information.\n\n");
                    contextBuilder.append("Evaluate the actual resume text and provide:\n");
                    contextBuilder.append("1. Overall ATS score out of 100\n");
                    contextBuilder.append("2. ATS compatibility assessment\n");
                    contextBuilder.append("3. Keyword optimization\n");
                    contextBuilder.append("4. Technical skills detected\n");
                    contextBuilder.append("5. Important missing keywords\n");
                    contextBuilder.append("6. Resume formatting/structure issues that may affect ATS parsing\n");
                    contextBuilder.append("7. Experience/project bullet quality\n");
                    contextBuilder.append("8. Measurable achievements that are missing\n");
                    contextBuilder.append("9. Section-by-section improvements\n");
                    contextBuilder.append("10. Specific rewritten bullet examples where useful\n");
                    contextBuilder.append("11. Final prioritized action list\n\n");
                    contextBuilder.append("If no job description is provided, evaluate the resume against a general software/technology fresher role.\n\n");
                    contextBuilder.append("Clearly distinguish between:\n");
                    contextBuilder.append("- information actually present in the resume\n");
                    contextBuilder.append("- missing information\n");
                    contextBuilder.append("- recommendations\n\n");
                    contextBuilder.append("Do not fabricate experience, skills, certifications, companies, or achievements.\n\n");
                    
                    contextBuilder.append("ACTUAL USER RESUME:\n-------------------\n");
                    contextBuilder.append(resumeText).append("\n-------------------\n\n");
                    contextBuilder.append("USER REQUEST:\n").append(request.getMessage()).append("\n\n");
                    
                    logger.info("ATS request detected. Resume found and text extracted successfully. Length: {}", resumeText.length());
                    isAtsRequest = true;
                } else {
                    contextBuilder.append("Resume Context:\n");
                    contextBuilder.append(resumeText).append("\n\n");
                }
            } catch (Exception e) {
                logger.error("Failed to extract resume text for user: {}", userId, e);
                AiChatMessage aiMessage = AiChatMessage.builder()
                        .session(session)
                        .sender(ChatSender.AI)
                        .message("I found your resume, but I couldn't read its contents. Please re-upload the resume as a supported PDF file.")
                        .messageType(MessageType.TEXT)
                        .tokensUsed(0)
                        .modelName("gemini-flash-latest")
                        .responseTimeMs(0L)
                        .build();
                AiChatMessage savedAiMessage = messageRepository.save(aiMessage);
                session.setUpdatedAt(savedAiMessage.getCreatedAt());
                sessionRepository.save(session);
                return mapToMessageResponse(savedAiMessage);
            }
        }
        
        // Fetch chat history for context
        List<AiChatMessage> chatHistory = messageRepository.findAllBySessionIdOrderByCreatedAtAsc(sessionId);
        
        // Generate AI Response
        long startTime = System.currentTimeMillis();
        String aiResponseText = aiProvider.generateResponse(contextBuilder.toString(), session.getChatMode(), chatHistory, request.getMessage());
        long responseTime = System.currentTimeMillis() - startTime;
        
        AiChatMessage aiMessage = AiChatMessage.builder()
                .session(session)
                .sender(ChatSender.AI)
                .message(aiResponseText)
                .messageType(MessageType.MARKDOWN)
                .tokensUsed(100) // Dummy analytics
                .modelName("gemini-flash-latest")
                .responseTimeMs(responseTime)
                .build();
        
        AiChatMessage savedAiMessage = messageRepository.save(aiMessage);
        
        // Update session timestamp
        session.setUpdatedAt(savedAiMessage.getCreatedAt());
        sessionRepository.save(session);
        
        if (isAtsRequest) {
            notificationService.createNotification(
                    session.getUser(),
                    "ATS review completed",
                    "Your ATS compatibility analysis is ready.",
                    NotificationType.ATS
            );
        }
        
        return mapToMessageResponse(savedAiMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getSessionMessages(UUID userId, UUID sessionId) {
        getAndValidateSession(userId, sessionId); // check ownership
        return messageRepository.findAllBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream().map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    private AiChatSession getAndValidateSession(UUID userId, UUID sessionId) {
        AiChatSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!session.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to session");
        }
        return session;
    }

    private ChatSessionResponse mapToSessionResponse(AiChatSession session) {
        ChatSessionResponse response = new ChatSessionResponse();
        response.setId(session.getId());
        response.setTitle(session.getTitle());
        response.setChatMode(session.getChatMode());
        response.setIsPinned(session.getIsPinned());
        response.setCreatedAt(session.getCreatedAt());
        response.setUpdatedAt(session.getUpdatedAt());
        return response;
    }

    private ChatMessageResponse mapToMessageResponse(AiChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setSessionId(message.getSession().getId());
        response.setSender(message.getSender());
        response.setMessage(message.getMessage());
        response.setMessageType(message.getMessageType());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}
