package com.interviewai.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        ApiError apiError = buildApiError(
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                errorMessage,
                request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiError> handleCustomValidation(
            ValidationException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailAlreadyExists(
            EmailAlreadyExistsException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.CONFLICT,
                "Conflict",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
    }

    @ExceptionHandler(DuplicateSkillException.class)
    public ResponseEntity<ApiError> handleDuplicateSkill(
            DuplicateSkillException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.CONFLICT,
                "Conflict",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(
            InvalidCredentialsException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.UNAUTHORIZED,
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ApiError> handleInvalidRefreshToken(
            InvalidRefreshTokenException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.UNAUTHORIZED,
                "Unauthorized",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(apiError);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.NOT_FOUND,
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {

        ApiError apiError = buildApiError(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            org.springframework.dao.DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        
        // Check if it's a constraint violation
        String message = "Database error";
        if (ex.getCause() instanceof org.hibernate.exception.ConstraintViolationException) {
            message = "Database constraint violation";
        }

        ApiError apiError = buildApiError(
                HttpStatus.CONFLICT,
                "Data Integrity Violation",
                message,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalException(
            Exception ex,
            HttpServletRequest request
    ) {

        // Print complete stack trace in console
        ex.printStackTrace();

        ApiError apiError = buildApiError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                ex.getMessage() == null ? ex.getClass().getSimpleName() : ex.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(apiError);
    }

    private ApiError buildApiError(
            HttpStatus status,
            String error,
            String message,
            String path
    ) {

        return ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(path)
                .build();
    }
}