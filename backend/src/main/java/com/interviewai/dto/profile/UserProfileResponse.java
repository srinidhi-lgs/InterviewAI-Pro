package com.interviewai.dto.profile;

import com.interviewai.entity.enums.Gender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;
import java.math.BigDecimal;

@Data
@Builder
public class UserProfileResponse {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String location;
    private String profileImageUrl;
    private String aboutMe;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String fullName;
    private String headline;
    private String college;
    private String degree;
    private String branch;
    private BigDecimal cgpa;
    private Integer graduationYear;
    private String bio;
    private String skills;
}
