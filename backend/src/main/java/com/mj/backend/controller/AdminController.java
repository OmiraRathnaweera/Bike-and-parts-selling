package com.mj.backend.controller;

import com.mj.backend.config.JwtUtils;
import com.mj.backend.dto.AdminDTO;
import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired private AdminService adminUserService;
    @Autowired private JwtUtils     jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody AdminDTO dto) {
        try {
            AdminDTO created = adminUserService.registerAdmin(dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ResponseDTO.success("Admin account created successfully", created));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody Map<String, String> body) {
        try {
            String   email = body.get("email");
            String   password = body.get("password");
            AdminDTO admin = adminUserService.loginAdmin(email, password);
            String   token = jwtUtils.generateToken(admin.getEmail());

            Map<String, Object> data = new HashMap<>();
            data.put("admin", admin);
            data.put("token", token);

            return ResponseEntity.ok(ResponseDTO.success("Login successful", data));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getAllAdmins() {
        try {
            List<AdminDTO> admins = adminUserService.getAllAdmins();
            return ResponseEntity.ok(ResponseDTO.success("Admins fetched", admins));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getAdminById(@PathVariable Long id) {
        try {
            AdminDTO admin = adminUserService.getAdminById(id);
            return ResponseEntity.ok(ResponseDTO.success("Admin fetched", admin));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateAdmin(
            @PathVariable Long id, @RequestBody AdminDTO dto) {
        try {
            AdminDTO updated = adminUserService.updateAdmin(id, dto);
            return ResponseEntity.ok(ResponseDTO.success("Profile updated", updated));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteAdmin(@PathVariable Long id) {
        try {
            adminUserService.deleteAdmin(id);
            return ResponseEntity.ok(ResponseDTO.success("Admin account deleted"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<ResponseDTO> changeRole(
            @PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String newRole     = (String) body.get("role");
            Long   requesterId = Long.valueOf(body.get("requesterId").toString());
            AdminDTO updated   = adminUserService.changeRole(id, newRole, requesterId);
            return ResponseEntity.ok(ResponseDTO.success("Role updated to " + newRole, updated));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping("/slots")
    public ResponseEntity<ResponseDTO> getRoleSlots() {
        try {
            AdminService.RoleSlotStatus slots = adminUserService.getRoleSlotStatus();
            return ResponseEntity.ok(ResponseDTO.success("Slot status fetched", slots));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }
}