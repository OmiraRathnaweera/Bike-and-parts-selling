package com.mj.backend.service;

import com.mj.backend.dto.AdminDTO;
import com.mj.backend.model.Admin;
import com.mj.backend.repository.AdminRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AdminService {

    @Autowired private AdminRepo            adminUserRepo;
    @Autowired private PasswordEncoder          passwordEncoder;
    @Autowired private ModelMapper              modelMapper;
    @Autowired private EmailVerificationService verificationService;

    private static final List<String> ALLOWED_ROLES  = Arrays.asList("OWNER","ACCOUNTANT","SALES_REP","STAFF");
    private static final List<String> SINGLETON_ROLES = Arrays.asList("OWNER","ACCOUNTANT");

    public AdminDTO registerAdmin(AdminDTO dto) throws Exception {

        if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty())
            throw new Exception("First name is required");
        if (dto.getLastName() == null || dto.getLastName().trim().isEmpty())
            throw new Exception("Last name is required");
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty())
            throw new Exception("Email is required");
        if (!dto.getEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new Exception("Invalid email address");
        if (adminUserRepo.existsByEmail(dto.getEmail().trim().toLowerCase()))
            throw new Exception("An account with this email already exists");

        if (dto.getPassword() == null || dto.getPassword().isEmpty())
            throw new Exception("Password is required");
        if (dto.getPassword().length() < 6)
            throw new Exception("Password must be at least 6 characters");
        if (dto.getConfirmPassword() != null && !dto.getPassword().equals(dto.getConfirmPassword()))
            throw new Exception("Passwords do not match");
        if (dto.getRole() == null || dto.getRole().trim().isEmpty())
            throw new Exception("Role is required");
        if (!ALLOWED_ROLES.contains(dto.getRole().toUpperCase()))
            throw new Exception("Invalid role. Allowed: OWNER, ACCOUNTANT, SALES_REP, STAFF");

        String role = dto.getRole().toUpperCase();

        if (role.equals("OWNER")      && adminUserRepo.countByRole("OWNER")      >= 1)
            throw new Exception("An OWNER account already exists. Only 1 OWNER is allowed.");
        if (role.equals("ACCOUNTANT") && adminUserRepo.countByRole("ACCOUNTANT") >= 1)
            throw new Exception("An ACCOUNTANT account already exists. Only 1 ACCOUNTANT is allowed.");

        // Email verification check
        verificationService.assertEmailVerified(dto.getEmail().trim());

        Admin admin = new Admin();
        admin.setFirstName(dto.getFirstName().trim());
        admin.setLastName(dto.getLastName().trim());
        admin.setEmail(dto.getEmail().trim().toLowerCase());
        admin.setPhone(dto.getPhone() != null ? dto.getPhone().trim() : "");
        admin.setCity(dto.getCity()   != null ? dto.getCity().trim()  : "");
        admin.setAddress(dto.getAddress() != null ? dto.getAddress().trim() : "");
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setRole(role);
        admin.setActive(true);

        Admin saved = adminUserRepo.save(admin);

        // Delete verification record after successful registration
        verificationService.cleanupVerification(dto.getEmail());

        return toDTO(saved);
    }

    // Login
    public AdminDTO loginAdmin(String email, String password) throws Exception {
        if (email == null || email.trim().isEmpty())     throw new Exception("Email is required");
        if (password == null || password.isEmpty())      throw new Exception("Password is required");

        Admin admin = adminUserRepo.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new Exception("No admin account found with this email"));

        if (!passwordEncoder.matches(password, admin.getPassword()))
            throw new Exception("Incorrect password");
        if (!admin.isActive())
            throw new Exception("This account has been deactivated. Contact the Owner.");

        return toDTO(admin);
    }

    // Get all
    public List<AdminDTO> getAllAdmins() {
        return adminUserRepo.findAll().stream().map(this::toDTO).toList();
    }

    //Get by ID
    public AdminDTO getAdminById(Long id) throws Exception {
        return toDTO(adminUserRepo.findById(id)
                .orElseThrow(() -> new Exception("Admin not found with ID: " + id)));
    }

    // Update
    public AdminDTO updateAdmin(Long id, AdminDTO dto) throws Exception {
        Admin admin = adminUserRepo.findById(id)
                .orElseThrow(() -> new Exception("Admin not found with ID: " + id));

        if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty())
            throw new Exception("First name cannot be empty");
        if (dto.getLastName() == null || dto.getLastName().trim().isEmpty())
            throw new Exception("Last name cannot be empty");

        admin.setFirstName(dto.getFirstName().trim());
        admin.setLastName(dto.getLastName().trim());
        if (dto.getPhone()   != null) admin.setPhone(dto.getPhone().trim());
        if (dto.getCity()    != null) admin.setCity(dto.getCity().trim());
        if (dto.getAddress() != null) admin.setAddress(dto.getAddress().trim());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isEmpty())
                throw new Exception("Current password is required to set a new password");
            if (!passwordEncoder.matches(dto.getCurrentPassword(), admin.getPassword()))
                throw new Exception("Current password is incorrect");
            if (dto.getPassword().length() < 6)
                throw new Exception("New password must be at least 6 characters");
            if (dto.getConfirmPassword() != null && !dto.getPassword().equals(dto.getConfirmPassword()))
                throw new Exception("Passwords do not match");
            admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return toDTO(adminUserRepo.save(admin));
    }

    // Delete
    public void deleteAdmin(Long id) throws Exception {
        Admin admin = adminUserRepo.findById(id)
                .orElseThrow(() -> new Exception("Admin not found with ID: " + id));
        if (admin.getRole().equals("OWNER") && adminUserRepo.countByRole("OWNER") <= 1)
            throw new Exception("Cannot delete the only OWNER account.");
        adminUserRepo.deleteById(id);
    }

    // Change role
    public AdminDTO changeRole(Long id, String newRole, Long requesterId) throws Exception {
        Admin requester = adminUserRepo.findById(requesterId)
                .orElseThrow(() -> new Exception("Requester not found"));
        if (!requester.getRole().equals("OWNER"))
            throw new Exception("Only the OWNER can change admin roles");

        Admin admin = adminUserRepo.findById(id)
                .orElseThrow(() -> new Exception("Admin not found with ID: " + id));

        if (!ALLOWED_ROLES.contains(newRole.toUpperCase()))
            throw new Exception("Invalid role");

        String role = newRole.toUpperCase();
        if (role.equals("OWNER")      && adminUserRepo.countByRole("OWNER")      >= 1 && !admin.getRole().equals("OWNER"))
            throw new Exception("An OWNER already exists.");
        if (role.equals("ACCOUNTANT") && adminUserRepo.countByRole("ACCOUNTANT") >= 1 && !admin.getRole().equals("ACCOUNTANT"))
            throw new Exception("An ACCOUNTANT already exists.");

        admin.setRole(role);
        return toDTO(adminUserRepo.save(admin));
    }

    // Availability
    public RoleSlotStatus getRoleSlotStatus() {
        return new RoleSlotStatus(
                adminUserRepo.countByRole("OWNER")      < 1,
                adminUserRepo.countByRole("ACCOUNTANT") < 1
        );
    }

    public record RoleSlotStatus(boolean ownerAvailable, boolean accountantAvailable) {}

    private AdminDTO toDTO(Admin admin) {
        AdminDTO dto = modelMapper.map(admin, AdminDTO.class);
        dto.setPassword(null);
        dto.setConfirmPassword(null);
        dto.setCurrentPassword(null);
        return dto;
    }
}