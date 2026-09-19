package com.interviewai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "skill_id")
    private UUID skillId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSkillId that = (UserSkillId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(skillId, that.skillId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, skillId);
    }
}
