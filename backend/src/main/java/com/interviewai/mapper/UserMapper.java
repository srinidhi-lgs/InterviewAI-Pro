package com.interviewai.mapper;

import com.interviewai.dto.auth.AuthResponse;
import com.interviewai.dto.auth.RegisterRequest;
import com.interviewai.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    User toEntity(RegisterRequest request);

    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "expiresIn", ignore = true)
    @Mapping(target = "tokenType", ignore = true)
    @Mapping(source = "id", target = "userId")
    AuthResponse toAuthResponse(User user);
}
