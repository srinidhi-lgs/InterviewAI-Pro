package com.interviewai.mapper;

import com.interviewai.dto.settings.UserSettingsResponse;
import com.interviewai.entity.UserSettings;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SettingsMapper {
    UserSettingsResponse toResponse(UserSettings userSettings);
}
