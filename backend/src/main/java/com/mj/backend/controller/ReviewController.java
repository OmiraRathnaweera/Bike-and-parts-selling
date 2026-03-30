package com.mj.backend.controller;

import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.dto.ReviewRequestDTO;
import com.mj.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Public - show all reviews ordered newest first.
    @GetMapping
    public ResponseEntity<ResponseDTO> getAllReviews() {
        return ResponseEntity.ok(
                ResponseDTO.success("Reviews fetched", reviewService.getAllReviews()));
    }

    // Public — show count and average rating for the summary strip.
    @GetMapping("/stats")
    public ResponseEntity<ResponseDTO> getStats() {
        double avg = reviewService.getAverageRating();
        long   count = reviewService.getAllReviews().size();
        return ResponseEntity.ok(
                ResponseDTO.success("Stats fetched",
                        Map.of("average", avg, "count", count)));
    }

    // Returns reviews by a specific user.
    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseDTO> getMyReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(
                ResponseDTO.success("Reviews fetched",
                        reviewService.getMyReviews(userId)));
    }

    // Create a new review for the authenticated user.
    @PostMapping("/user/{userId}")
    public ResponseEntity<ResponseDTO> createReview(
            @PathVariable Long userId,
            @RequestBody ReviewRequestDTO req) {
        return reviewService.createReview(userId, req)
                .map(dto -> ResponseEntity.ok(
                        ResponseDTO.success("Review submitted", dto)))
                .orElse(ResponseEntity.ok(
                        ResponseDTO.error("Invalid review data (check rating 1-5 and non-empty comment)")));
    }

    // Update own review only.
    @PutMapping("/{id}/user/{userId}")
    public ResponseEntity<ResponseDTO> updateReview(
            @PathVariable Long id,
            @PathVariable Long userId,
            @RequestBody ReviewRequestDTO req) {
        return reviewService.updateReview(id, userId, req)
                .map(dto -> ResponseEntity.ok(
                        ResponseDTO.success("Review updated", dto)))
                .orElse(ResponseEntity.ok(
                        ResponseDTO.error("Review not found or not yours")));
    }

    // Delete own review only.
    @DeleteMapping("/{id}/user/{userId}")
    public ResponseEntity<ResponseDTO> deleteReview(
            @PathVariable Long id,
            @PathVariable Long userId) {
        boolean deleted = reviewService.deleteReview(id, userId);
        return ResponseEntity.ok(deleted
                ? ResponseDTO.success("Review deleted", null)
                : ResponseDTO.error("Review not found or not yours"));
    }
}