package com.mj.backend.service;

import com.mj.backend.dto.ContactDTO;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.contact.recipient-email}")
    private String recipientEmail;

    @Value("${app.contact.from-name}")
    private String fromName;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendContactEmail(ContactDTO dto) throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setTo(recipientEmail);
            helper.setFrom(senderEmail);
            helper.setReplyTo(dto.getEmail());
            helper.setSubject("[M&J Contact] " + dto.getSubject());
            helper.setText(buildEmailHtml(dto), true);

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("EMAIL SEND FAILED");
            System.err.println("Recipient : " + recipientEmail);
            System.err.println("Sender    : " + senderEmail);
            System.err.println("Error     : " + e.getMessage());
            Throwable cause = e.getCause();
            while (cause != null) {
                System.err.println("Caused by : " + cause.getMessage());
                cause = cause.getCause();
            }
            System.err.println("");
            throw e;
        }
    }

    private String buildEmailHtml(ContactDTO dto) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8"/>
              <style>
                body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px; }
                .card { background:#fff; border-radius:12px; max-width:600px; margin:0 auto;
                        border:1px solid #e5e7eb; overflow:hidden; }
                .header { background:linear-gradient(135deg,#1e40af,#2563eb);
                          padding:28px 32px; color:white; }
                .header h1 { margin:0; font-size:22px; font-weight:900; }
                .header p  { margin:6px 0 0; font-size:13px; opacity:0.8; }
                .body { padding:32px; }
                .field { margin-bottom:20px; }
                .field label { display:block; font-size:11px; font-weight:700;
                               color:#6b7280; text-transform:uppercase;
                               letter-spacing:0.08em; margin-bottom:6px; }
                .field .value { font-size:14px; color:#111827; font-weight:600;
                                background:#f9fafb; border:1px solid #e5e7eb;
                                border-radius:8px; padding:10px 14px; }
                .message-box { background:#f9fafb; border:1px solid #e5e7eb;
                               border-radius:8px; padding:16px; font-size:14px;
                               color:#374151; white-space:pre-wrap; line-height:1.6; }
                .footer { background:#f9fafb; border-top:1px solid #e5e7eb;
                          padding:16px 32px; font-size:11px; color:#9ca3af; text-align:center; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <h1>New Contact Message</h1>
                  <p>Received via M&amp;J Enterprises website</p>
                </div>
                <div class="body">
                  <div class="field">
                    <label>From</label>
                    <div class="value">%s</div>
                  </div>
                  <div class="field">
                    <label>Reply-To Email</label>
                    <div class="value">%s</div>
                  </div>
                  <div class="field">
                    <label>Subject</label>
                    <div class="value">%s</div>
                  </div>
                  <div class="field">
                    <label>Message</label>
                    <div class="message-box">%s</div>
                  </div>
                </div>
                <div class="footer">
                  M&amp;J Enterprises · Sent from website contact form · Reply to respond to %s
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                escapeHtml(dto.getName()),
                escapeHtml(dto.getEmail()),
                escapeHtml(dto.getSubject()),
                escapeHtml(dto.getMessage()),
                escapeHtml(dto.getName())
        );
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
            .replace("&",  "&amp;")
            .replace("<",  "&lt;")
            .replace(">",  "&gt;")
            .replace("\"", "&quot;")
            .replace("'",  "&#x27;");
    }
}