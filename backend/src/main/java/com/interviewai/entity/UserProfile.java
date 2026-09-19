package com.interviewai.entity;

import com.interviewai.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Gender gender;

    @Column(length = 255)
    private String location;

    @Column(name = "profile_image_url", length = 1024)
    private String profileImageUrl;

    @Column(name = "about_me", columnDefinition = "TEXT")
    private String aboutMe;

    @Column(name = "linkedin_url", length = 1024)
    private String linkedinUrl;

    @Column(name = "github_url", length = 1024)
    private String githubUrl;

    @Column(name = "portfolio_url", length = 1024)
    private String portfolioUrl;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "college", length = 255)
    private String college;

    @Column(name = "degree", length = 100)
    private String degree;

    @Column(name = "branch", length = 100)
    private String branch;

    @Column(name = "cgpa")
    private BigDecimal cgpa;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
