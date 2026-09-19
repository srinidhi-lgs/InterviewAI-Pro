package com.interviewai.dto.profile;

import com.interviewai.entity.enums.Gender;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@Builder
public class UserProfileRequest {
    @Size(max = 100)
    private String firstName;
    
    @Size(max = 100)
    private String lastName;
    
    @Size(max = 20)
    private String phoneNumber;
    
    @Past
    private LocalDate dateOfBirth;
    
    private Gender gender;
    
    @Size(max = 255)
    private String location;
    
    private String aboutMe;
    
    @Size(max = 1024)
    private String linkedinUrl;
    
    @Size(max = 1024)
    private String githubUrl;
    
    @Size(max = 1024)
    private String portfolioUrl;
    
    @Size(max = 255)
    private String fullName;
    
    @Size(max = 255)
    private String headline;
    
    @Size(max = 255)
    private String college;
    
    @Size(max = 100)
    private String degree;
    
    @Size(max = 100)
    private String branch;
    
    private BigDecimal cgpa;
    
    private Integer graduationYear;
    
    private String bio;
    
    private String skills;
}
