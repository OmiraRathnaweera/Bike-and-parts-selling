package com.mj.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long          id;

    @NotNull(message = "User ID is required")
    private Long          userId;

    private String        userName;

    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 500, message = "Comment must be under 500 characters")
    private String        comment;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int           rating;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}