package com.interviewai.mapper;

import com.interviewai.dto.profile.UserProfileRequest;
import com.interviewai.dto.profile.UserProfileResponse;
import com.interviewai.dto.profile.SkillRequest;
import com.interviewai.dto.profile.SkillResponse;
import com.interviewai.dto.profile.UserSkillResponse;
import com.interviewai.entity.UserProfile;
import com.interviewai.entity.Skill;
import com.interviewai.entity.UserSkill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    
    @Mapping(target = "userId", source = "user.id")
    UserProfileResponse toProfileResponse(UserProfile userProfile);

    @org.mapstruct.BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProfileFromRequest(UserProfileRequest request, @MappingTarget UserProfile userProfile);

    SkillResponse toSkillResponse(Skill skill);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Skill toSkill(SkillRequest request);

    @Mapping(target = "skill", source = "skill")
    UserSkillResponse toUserSkillResponse(UserSkill userSkill);
}
