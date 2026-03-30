package com.mj.backend.controller;

import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.service.EmailVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/verify")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailVerificationController {

    @Autowired
    private EmailVerificationService verificationService;

    @PostMapping("/send")
    public ResponseEntity<ResponseDTO> sendCode(@RequestBody Map<String, String> body) {
        try {
            String email   = body.get("email");
            String context = body.getOrDefault("context", "user");
            verificationService.sendVerificationCode(email, context);
            return ResponseEntity.ok(
                    ResponseDTO.success("Verification code sent to " + email + ". Check your inbox.")
            );
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<ResponseDTO> confirmCode(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code  = body.get("code");
            verificationService.verifyCode(email, code);
            return ResponseEntity.ok(
                    ResponseDTO.success("Email verified successfully! You can now complete registration.")
            );
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }
}