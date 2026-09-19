package com.interviewai.entity;

import com.interviewai.entity.enums.ProficiencyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {

    @EmbeddedId
    @Builder.Default
    private UserSkillId id = new UserSkillId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level", nullable = false, length = 20)
    private ProficiencyLevel proficiencyLevel;

    @Column(name = "years_of_experience", nullable = false)
    private Integer yearsOfExperience;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public UserSkill(User user, Skill skill, ProficiencyLevel proficiencyLevel, Integer yearsOfExperience) {
        this.user = user;
        this.skill = skill;
        this.proficiencyLevel = proficiencyLevel;
        this.yearsOfExperience = yearsOfExperience;
        this.id = new UserSkillId(user.getId(), skill.getId());
    }

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
