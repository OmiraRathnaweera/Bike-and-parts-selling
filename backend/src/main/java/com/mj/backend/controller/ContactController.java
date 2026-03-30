package com.mj.backend.controller;

import com.mj.backend.dto.ContactDTO;
import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<ResponseDTO> sendContactEmail(@Valid @RequestBody ContactDTO dto) {
        try {
            emailService.sendContactEmail(dto);
            return ResponseEntity.ok(
                    ResponseDTO.success("Message sent successfully! We'll get back to you soon.")
            );
        } catch (Exception e) {
            System.err.println("Email send failed: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error("Failed to send message. Please try again or contact us directly."));
        }
    }
}
