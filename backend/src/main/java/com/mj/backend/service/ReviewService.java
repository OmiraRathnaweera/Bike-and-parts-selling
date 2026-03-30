package com.mj.backend.service;

import com.mj.backend.dto.ReviewDTO;
import com.mj.backend.dto.ReviewRequestDTO;
import com.mj.backend.model.Review;
import com.mj.backend.repository.ReviewRepo;
import com.mj.backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepo reviewRepo;
    @Autowired private UserRepo   userRepo;

    private ReviewDTO toDTO(Review r) {
        String name = r.getUser().getFirstName() + " " + r.getUser().getLastName();
        return new ReviewDTO(
                r.getId(),
                r.getUser().getId(),
                name,
                r.getComment(),
                r.getRating(),
                r.getCreatedAt(),
                r.getUpdatedAt()
        );
    }

    // GET all reviews
    public List<ReviewDTO> getAllReviews() {
        return reviewRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // GET reviews by user
    public List<ReviewDTO> getMyReviews(Long userId) {
        return reviewRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // CREATE
    @Transactional
    public Optional<ReviewDTO> createReview(Long userId, ReviewRequestDTO req) {
        if (req.getComment() == null || req.getComment().isBlank())
            return Optional.empty();
        if (req.getRating() < 1 || req.getRating() > 5)
            return Optional.empty();

        return userRepo.findById(userId).map(user -> {
            Review review = new Review();
            review.setUser(user);
            review.setComment(req.getComment().trim());
            review.setRating(req.getRating());
            return toDTO(reviewRepo.save(review));
        });
    }

    // UPDATE (own only)
    @Transactional
    public Optional<ReviewDTO> updateReview(Long reviewId, Long userId, ReviewRequestDTO req) {
        if (req.getComment() == null || req.getComment().isBlank())
            return Optional.empty();
        if (req.getRating() < 1 || req.getRating() > 5)
            return Optional.empty();

        return reviewRepo.findByIdAndUserId(reviewId, userId).map(review -> {
            review.setComment(req.getComment().trim());
            review.setRating(req.getRating());
            return toDTO(reviewRepo.save(review));
        });
    }

    // DELETE (own only)
    @Transactional
    public boolean deleteReview(Long reviewId, Long userId) {
        return reviewRepo.findByIdAndUserId(reviewId, userId).map(review -> {
            reviewRepo.delete(review);
            return true;
        }).orElse(false);
    }

    // Average rating
    public double getAverageRating() {
        List<Review> all = reviewRepo.findAll();
        if (all.isEmpty()) return 0;
        return all.stream().mapToInt(Review::getRating).average().orElse(0);
    }
}