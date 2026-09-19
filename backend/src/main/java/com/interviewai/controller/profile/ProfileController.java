package com.interviewai.controller.profile;

import com.interviewai.dto.ApiResponse;
import com.interviewai.dto.profile.UserProfileRequest;
import com.interviewai.dto.profile.UserProfileResponse;
import com.interviewai.dto.profile.UserSkillRequest;
import com.interviewai.dto.profile.UserSkillResponse;
import com.interviewai.service.profile.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@Tag(name = "Candidate Profile", description = "Candidate Profile Management APIs")
public class ProfileController {

    private final UserProfileService userProfileService;

    @Operation(summary = "Get user profile", description = "Returns the authenticated user's profile. Creates an empty one if it doesn't exist.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        return ResponseEntity.ok(
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("Profile retrieved successfully")
                        .data(userProfileService.getProfile())
                        .build()
        );
    }

    @Operation(summary = "Update user profile", description = "Updates the authenticated user's profile.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @PutMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(@Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("Profile updated successfully")
                        .data(userProfileService.updateProfile(request))
                        .build()
        );
    }

    @Operation(summary = "Create user profile", description = "Creates or updates the authenticated user's profile.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile created successfully")
    @PostMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> createProfile(@Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("Profile created successfully")
                        .data(userProfileService.updateProfile(request))
                        .build()
        );
    }

    @Operation(summary = "Upload profile image", description = "Uploads a profile image for the user")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Image uploaded successfully")
    @PostMapping("/image")
    public ResponseEntity<ApiResponse<UserProfileResponse>> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("Image uploaded successfully")
                        .data(userProfileService.uploadProfileImage(file))
                        .build()
        );
    }

    @Operation(summary = "Delete profile image", description = "Deletes the profile image for the user")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Image deleted successfully")
    @DeleteMapping("/image")
    public ResponseEntity<ApiResponse<UserProfileResponse>> deleteProfileImage() {
        return ResponseEntity.ok(
                ApiResponse.<UserProfileResponse>builder()
                        .success(true)
                        .message("Image deleted successfully")
                        .data(userProfileService.deleteProfileImage())
                        .build()
        );
    }

    @Operation(summary = "Get user skills", description = "Returns the list of skills for the authenticated user.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Skills retrieved successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<UserSkillResponse>>> getSkills() {
        return ResponseEntity.ok(
                ApiResponse.<List<UserSkillResponse>>builder()
                        .success(true)
                        .message("Skills retrieved successfully")
                        .data(userProfileService.getUserSkills())
                        .build()
        );
    }

    @Operation(summary = "Add user skill", description = "Adds a new skill to the user's profile.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Skill added successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Skill already exists for this user")
    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<UserSkillResponse>> addSkill(@Valid @RequestBody UserSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<UserSkillResponse>builder()
                        .success(true)
                        .message("Skill added successfully")
                        .data(userProfileService.addSkill(request))
                        .build()
        );
    }

    @Operation(summary = "Update user skill", description = "Updates an existing skill in the user's profile.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Skill updated successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request data")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Skill not found")
    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<UserSkillResponse>> updateSkill(@PathVariable UUID id, @Valid @RequestBody UserSkillRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<UserSkillResponse>builder()
                        .success(true)
                        .message("Skill updated successfully")
                        .data(userProfileService.updateSkill(id, request))
                        .build()
        );
    }

    @Operation(summary = "Delete user skill", description = "Removes a skill from the user's profile.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Skill deleted successfully")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Skill not found")
    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable UUID id) {
        userProfileService.deleteSkill(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Skill deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
