package com.mj.backend.service;

import com.mj.backend.model.Admin;
import com.mj.backend.model.User;
import com.mj.backend.model.EmailVerification;
import com.mj.backend.repository.AdminRepo;
import com.mj.backend.repository.UserRepo;
import com.mj.backend.repository.EmailVerificationRepo;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    @Autowired private UserRepo              userRepo;
    @Autowired private AdminRepo         adminUserRepo;
    @Autowired private EmailVerificationRepo verificationRepo;
    @Autowired private JavaMailSender        mailSender;
    @Autowired private PasswordEncoder       passwordEncoder;

    @Value("${spring.mail.username}")
    private String senderEmail;

    private static final int EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS   = 5;

    // Send reset code
    public void sendResetCode(String email, String context) throws Exception {

        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new Exception("Invalid email address");

        String e = email.trim().toLowerCase();

        // Account must exist
        if ("admin".equals(context)) {
            if (!adminUserRepo.existsByEmail(e))
                throw new Exception("No admin account found with this email");
        } else {
            if (!userRepo.existsByEmail(e))
                throw new Exception("No account found with this email");
        }

        String code = String.valueOf(100000 + new SecureRandom().nextInt(900000));
        verificationRepo.deleteByEmail(e);

        EmailVerification v = new EmailVerification();
        v.setEmail(e);
        v.setCode(code);
        v.setExpiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
        v.setVerified(false);
        v.setAttempts(0);
        verificationRepo.save(v);

        sendResetEmail(e, code);
    }

    public void resetPassword(String email, String newPassword, String context)
            throws Exception {

        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");
        if (newPassword == null || newPassword.isEmpty())
            throw new Exception("New password is required");
        if (newPassword.length() < 6)
            throw new Exception("Password must be at least 6 characters");

        String e = email.trim().toLowerCase();

        // Check that email was verified
        boolean isVerified = verificationRepo.existsByEmailAndVerifiedTrue(e);
        if (!isVerified)
            throw new Exception("Email not verified. Please go back and verify your code.");

        // Update the password
        String hashed = passwordEncoder.encode(newPassword);
        if ("admin".equals(context)) {
            Admin admin = adminUserRepo.findByEmail(e)
                    .orElseThrow(() -> new Exception("Admin account not found"));
            admin.setPassword(hashed);
            adminUserRepo.save(admin);
        } else {
            User user = userRepo.findByEmail(e)
                    .orElseThrow(() -> new Exception("Account not found"));
            user.setPassword(hashed);
            userRepo.save(user);
        }

        // Delete verification record after successful reset
        verificationRepo.deleteByEmail(e);
    }

    private void sendResetEmail(String toEmail, String code) throws Exception {
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
        h.setTo(toEmail);
        h.setFrom(senderEmail);
        h.setSubject("M&J Enterprises — Password Reset Code");
        h.setText(buildHtml(toEmail, code), true);
        mailSender.send(msg);
    }

    private String buildHtml(String email, String code) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8"/>
            <style>
              body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px}
              .card{background:#fff;border-radius:14px;max-width:480px;margin:0 auto;border:1px solid #e5e7eb;overflow:hidden}
              .header{background:linear-gradient(135deg,#1e40af,#2563eb);padding:28px 32px;color:white;text-align:center}
              .body{padding:32px;text-align:center}
              .code-box{background:#fff7ed;border:2px dashed #f97316;border-radius:14px;padding:20px 32px;margin:24px 0;display:inline-block}
              .code{font-size:42px;font-weight:900;color:#ea580c;letter-spacing:10px;font-family:monospace}
              .info{color:#6b7280;font-size:13px;line-height:1.6}
              .warn{background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px 16px;color:#9a3412;font-size:12px;margin-top:16px}
              .footer{background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;font-size:11px;color:#9ca3af;text-align:center}
            </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <div style="width:48px;height:48px;background:#d30000;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:white;margin-bottom:12px">MJ</div>
                  <h1 style="margin:0;font-size:20px;font-weight:900">Password Reset</h1>
                  <p style="margin:4px 0 0;font-size:13px;opacity:.8">M&amp;J Enterprises</p>
                </div>
                <div class="body">
                  <p class="info">Your password reset code for <strong>%s</strong></p>
                  <div class="code-box"><div class="code">%s</div></div>
                  <p class="info">Expires in <strong>10 minutes</strong> &nbsp;·&nbsp; Max 5 attempts</p>
                  <div class="warn">⚠ If you didn't request this, ignore this email. Your password won't change.</div>
                </div>
                <div class="footer">M&amp;J Enterprises · Do not reply to this email.</div>
              </div>
            </body></html>
            """.formatted(email, code);
    }
}