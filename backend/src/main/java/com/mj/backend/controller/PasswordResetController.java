package com.mj.backend.controller;

import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    // Send reset code to email
    @PostMapping("/forgot")
    public ResponseEntity<ResponseDTO> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            String email   = body.get("email");
            String context = body.getOrDefault("context", "user");
            passwordResetService.sendResetCode(email, context);
            return ResponseEntity.ok(
                    ResponseDTO.success("Reset code sent to " + email + ". Check your inbox.")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Set new password
    @PostMapping("/reset")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String email       = body.get("email");
            String newPassword = body.get("newPassword");
            String context     = body.getOrDefault("context", "user");
            passwordResetService.resetPassword(email, newPassword, context);
            return ResponseEntity.ok(
                    ResponseDTO.success("Password reset successfully. You can now log in.")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }
}