package com.mj.backend.service;

import com.mj.backend.model.EmailVerification;
import com.mj.backend.repository.AdminRepo;
import com.mj.backend.repository.EmailVerificationRepo;
import com.mj.backend.repository.UserRepo;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class EmailVerificationService {

    @Autowired private EmailVerificationRepo verificationRepo;
    @Autowired private UserRepo              userRepo;
    @Autowired private AdminRepo adminUserRepo;
    @Autowired private JavaMailSender        mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    private static final int EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    // SEND VERIFICATION CODE
    public void sendVerificationCode(String email, String context) throws Exception {
        // Email must not be blank
        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");

        // Basic email format check
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new Exception("Invalid email address format");

        String normalizedEmail = email.trim().toLowerCase();

        // For user registration - email must not already be registered
        if ("user".equals(context) && userRepo.existsByEmail(normalizedEmail))
            throw new Exception("This email is already registered. Please log in.");

        // For admin registration - email must not already be registered
        if ("admin".equals(context) && adminUserRepo.existsByEmail(normalizedEmail))
            throw new Exception("This email is already registered as an admin.");

        // Generate a secure 6-digit code
        String code = generateCode();

        verificationRepo.deleteByEmail(normalizedEmail);

        EmailVerification verification = new EmailVerification();
        verification.setEmail(normalizedEmail);
        verification.setCode(code);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        verification.setVerified(false);
        verification.setAttempts(0);
        verificationRepo.save(verification);

        sendCodeEmail(normalizedEmail, code);
    }

    // VERIFY CODE
    public void verifyCode(String email, String code) throws Exception {

        // Email required
        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");

        // Code required
        if (code == null || code.trim().isEmpty())
            throw new Exception("Verification code is required");

        String normalizedEmail = email.trim().toLowerCase();

        // A code must exist for this email
        EmailVerification verification = verificationRepo
                .findTopByEmailOrderByIdDesc(normalizedEmail)
                .orElseThrow(() -> new Exception("No verification code found. Please request a new one."));

        // Code must not be already used
        if (verification.isVerified())
            throw new Exception("This code has already been used. Please request a new one.");

        // Max attempts check — blocks brute force
        if (verification.getAttempts() >= MAX_ATTEMPTS)
            throw new Exception("Too many failed attempts. Please request a new verification code.");

        // Code must not be expired (10-minute window)
        if (LocalDateTime.now().isAfter(verification.getExpiresAt()))
            throw new Exception("Verification code has expired. Please request a new one.");

        // Code must match exactly
        if (!verification.getCode().equals(code.trim())) {
            verification.setAttempts(verification.getAttempts() + 1);
            verificationRepo.save(verification);

            int remaining = MAX_ATTEMPTS - verification.getAttempts();
            if (remaining <= 0)
                throw new Exception("Too many failed attempts. Please request a new verification code.");
            throw new Exception("Incorrect code. " + remaining + " attempt" + (remaining == 1 ? "" : "s") + " remaining.");
        }

        verification.setVerified(true);
        verificationRepo.save(verification);
    }

    // CHECK IF EMAIL IS VERIFIED
    // Called by UserService and AdminUserService before saving the new account
    public void assertEmailVerified(String email) throws Exception {
        String normalizedEmail = email.trim().toLowerCase();

        boolean isVerified = verificationRepo.existsByEmailAndVerifiedTrue(normalizedEmail);

        if (!isVerified)
            throw new Exception("Email not verified. Please verify your email before registering.");
    }

    public void cleanupVerification(String email) {
        verificationRepo.deleteByEmail(email.trim().toLowerCase());
    }

    // Generate secure 6-digit numeric code
    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    // Send the code via Gmail SMTP
    private void sendCodeEmail(String toEmail, String code) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

        helper.setTo(toEmail);
        helper.setFrom(senderEmail);
        helper.setSubject("M&J Enterprises — Email Verification Code");
        helper.setText(buildEmailHtml(toEmail, code), true);

        mailSender.send(message);
    }

    private String buildEmailHtml(String email, String code) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"/>
            <style>
              body { font-family:Arial,sans-serif; background:#f5f5f5; margin:0; padding:20px; }
              .card { background:#fff; border-radius:14px; max-width:480px; margin:0 auto;
                      border:1px solid #e5e7eb; overflow:hidden; }
              .header { background:linear-gradient(135deg,#1e40af,#2563eb); padding:28px 32px; color:white; text-align:center; }
              .logo { width:48px; height:48px; background:#d30000; border-radius:12px;
                      display:inline-flex; align-items:center; justify-content:center;
                      font-weight:900; font-size:16px; color:white; margin-bottom:12px; }
              .title { margin:0; font-size:20px; font-weight:900; }
              .sub   { margin:4px 0 0; font-size:13px; opacity:0.8; }
              .body  { padding:32px; text-align:center; }
              .code-box { background:#f0f7ff; border:2px dashed #3b82f6; border-radius:14px;
                          padding:20px 32px; margin:24px 0; display:inline-block; }
              .code { font-size:42px; font-weight:900; color:#1d4ed8; letter-spacing:10px;
                      font-family:monospace; }
              .info { color:#6b7280; font-size:13px; line-height:1.6; }
              .warning { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px;
                         padding:12px 16px; color:#9a3412; font-size:12px; margin-top:16px; }
              .footer { background:#f9fafb; border-top:1px solid #e5e7eb; padding:16px 32px;
                        font-size:11px; color:#9ca3af; text-align:center; }
            </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <div class="logo">MJ</div>
                  <h1 class="title">Verify Your Email</h1>
                  <p class="sub">M&amp;J Enterprises Account Registration</p>
                </div>
                <div class="body">
                  <p class="info">Use the code below to verify <strong>%s</strong></p>
                  <div class="code-box">
                    <div class="code">%s</div>
                  </div>
                  <p class="info">This code expires in <strong>10 minutes</strong>.</p>
                  <div class="warning">
                    ⚠ If you didn't request this, please ignore this email.
                    Do not share this code with anyone.
                  </div>
                </div>
                <div class="footer">
                  M&amp;J Enterprises · This is an automated message, please do not reply.
                </div>
              </div>
            </body>
            </html>
            """.formatted(email, code);
    }
}