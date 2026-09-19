package com.interviewai.service.profile;

import com.interviewai.dto.profile.*;
import com.interviewai.entity.Skill;
import com.interviewai.entity.User;
import com.interviewai.entity.UserProfile;
import com.interviewai.entity.UserSkill;
import com.interviewai.exception.DuplicateSkillException;
import com.interviewai.exception.ResourceNotFoundException;
import com.interviewai.mapper.ProfileMapper;
import com.interviewai.repository.SkillRepository;
import com.interviewai.repository.UserProfileRepository;
import com.interviewai.repository.UserSkillRepository;
import com.interviewai.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final ProfileMapper profileMapper;
    private final CurrentUserService currentUserService;

    @Transactional
    public UserProfileResponse getProfile() {
        final User user = currentUserService.getCurrentUser();
        
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    log.info("Creating empty profile for user: {}", user.getId());
                    UserProfile newProfile = UserProfile.builder().user(user).build();
                    return userProfileRepository.save(newProfile);
                });
                
        return profileMapper.toProfileResponse(profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(final UserProfileRequest request) {
        final User user = currentUserService.getCurrentUser();
        
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    log.info("Creating empty profile before update for user: {}", user.getId());
                    UserProfile newProfile = UserProfile.builder().user(user).build();
                    return userProfileRepository.save(newProfile);
                });

        profileMapper.updateProfileFromRequest(request, profile);
        profile = userProfileRepository.save(profile);
        
        log.info("Profile updated successfully for user: {}", user.getId());
        return profileMapper.toProfileResponse(profile);
    }

    @Transactional
    public UserProfileResponse uploadProfileImage(final MultipartFile file) {
        final User user = currentUserService.getCurrentUser();
        
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> userProfileRepository.save(UserProfile.builder().user(user).build()));

        // In a real application, upload file to S3/Cloud Storage here.
        // For now, mock a URL.
        String fileUrl = "https://example.com/uploads/" + UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        profile.setProfileImageUrl(fileUrl);
        
        profile = userProfileRepository.save(profile);
        log.info("Profile image uploaded for user: {}", user.getId());
        return profileMapper.toProfileResponse(profile);
    }

    @Transactional
    public UserProfileResponse deleteProfileImage() {
        final User user = currentUserService.getCurrentUser();
        
        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profile.setProfileImageUrl(null);
        
        profile = userProfileRepository.save(profile);
        log.info("Profile image deleted for user: {}", user.getId());
        return profileMapper.toProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> getUserSkills() {
        final User user = currentUserService.getCurrentUser();
        return userSkillRepository.findByUserId(user.getId()).stream()
                .map(profileMapper::toUserSkillResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSkillResponse addSkill(final UserSkillRequest request) {
        final User user = currentUserService.getCurrentUser();
        final String skillName = request.getSkill().getName().trim();

        Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                .orElseGet(() -> {
                    log.info("Creating new global skill: {}", skillName);
                    Skill newSkill = profileMapper.toSkill(request.getSkill());
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });

        if (userSkillRepository.existsByUserIdAndSkillId(user.getId(), skill.getId())) {
            log.warn("User {} attempted to add duplicate skill {}", user.getId(), skill.getId());
            throw new DuplicateSkillException("Skill already exists in your profile.");
        }

        UserSkill userSkill = new UserSkill(user, skill, request.getProficiencyLevel(), request.getYearsOfExperience());
        userSkill = userSkillRepository.save(userSkill);

        log.info("Skill {} added to user {}", skill.getId(), user.getId());
        return profileMapper.toUserSkillResponse(userSkill);
    }

    @Transactional
    public UserSkillResponse updateSkill(final UUID skillId, final UserSkillRequest request) {
        final User user = currentUserService.getCurrentUser();
        
        UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(user.getId(), skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found in your profile"));

        userSkill.setProficiencyLevel(request.getProficiencyLevel());
        userSkill.setYearsOfExperience(request.getYearsOfExperience());
        
        userSkill = userSkillRepository.save(userSkill);
        
        log.info("Skill {} updated for user {}", skillId, user.getId());
        return profileMapper.toUserSkillResponse(userSkill);
    }

    @Transactional
    public void deleteSkill(final UUID skillId) {
        final User user = currentUserService.getCurrentUser();
        
        UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(user.getId(), skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found in your profile"));

        userSkillRepository.delete(userSkill);
        log.info("Skill {} deleted for user {}", skillId, user.getId());
    }
}
