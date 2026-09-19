package com.interviewai;

import com.interviewai.service.resume.ParsedResume;
import com.interviewai.service.resume.ResumeParserService;
import com.interviewai.repository.UserRepository;
import com.interviewai.entity.User;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ResumeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResumeParserService parserService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @WithMockUser(username = "testuser@test.com", roles = "USER")
    public void testResumeUploadWithJD() throws Exception {
        // Create user in DB for CurrentUserService to find
        if (userRepository.findByEmail("testuser@test.com").isEmpty()) {
            User user = new User();
            user.setEmail("testuser@test.com");
            user.setPasswordHash("dummy_hash");
            userRepository.save(user);
        }

        // Mock the parser
        ParsedResume parsed = new ParsedResume();
        parsed.setRawText("Experience in React Java Spring Boot PostgreSQL Git");
        parsed.setCandidateName("Test User");
        parsed.setEmail("test@test.com");
        parsed.setPhone("1234567890");
        parsed.setExperienceText("Experience in React Java Spring Boot PostgreSQL Git");
        
        Mockito.when(parserService.parseResume(any(InputStream.class))).thenReturn(parsed);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                "dummy pdf content".getBytes()
        );

        String jd = "Full Stack Developer. We are looking for a Full Stack Developer with experience in React.js, Java, Spring Boot, REST APIs, PostgreSQL, Git and Docker.";

        String response = mockMvc.perform(multipart("/api/v1/resume/upload")
                .file(file)
                .param("jobDescription", jd))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        System.out.println("==================================================");
        System.out.println("API RESPONSE UPLOAD:");
        System.out.println(response);
        System.out.println("==================================================");

        // Fetch latest
        String latestResponse = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/v1/resume/latest"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        System.out.println("==================================================");
        System.out.println("API RESPONSE LATEST:");
        System.out.println(latestResponse);
        System.out.println("==================================================");
    }
}
