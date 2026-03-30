package com.mj.backend.service;

import com.mj.backend.dto.UserDTO;
import com.mj.backend.model.User;
import com.mj.backend.repository.UserRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired private UserRepo                  userRepo;
    @Autowired private PasswordEncoder           passwordEncoder;
    @Autowired private ModelMapper               modelMapper;
    @Autowired private EmailVerificationService  verificationService;

    // Register
    public UserDTO registerUser(UserDTO dto) throws Exception {

        if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty())
            throw new Exception("First name is required");
        if (dto.getLastName() == null || dto.getLastName().trim().isEmpty())
            throw new Exception("Last name is required");
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty())
            throw new Exception("Email is required");
        if (dto.getPassword() == null || dto.getPassword().isEmpty())
            throw new Exception("Password is required");
        if (dto.getPassword().length() < 6)
            throw new Exception("Password must be at least 6 characters");
        if (dto.getConfirmPassword() != null && !dto.getPassword().equals(dto.getConfirmPassword()))
            throw new Exception("Passwords do not match");
        if (userRepo.existsByEmail(dto.getEmail().trim()))
            throw new Exception("Email already registered");

        // Email verification check
        verificationService.assertEmailVerified(dto.getEmail().trim());

        User user = modelMapper.map(dto, User.class);
        user.setId(null);
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole("USER");

        User saved = userRepo.save(user);

        // Delete verification record
        verificationService.cleanupVerification(dto.getEmail());

        UserDTO result = modelMapper.map(saved, UserDTO.class);
        result.setPassword(null);
        result.setConfirmPassword(null);
        return result;
    }

    // Login
    public UserDTO loginUser(String email, String password) throws Exception {

        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");
        if (password == null || password.isEmpty())
            throw new Exception("Password is required");

        User user = userRepo.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new Exception("No account found with this email"));

        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new Exception("Incorrect password");

        UserDTO result = modelMapper.map(user, UserDTO.class);
        result.setPassword(null);
        return result;
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream().map(u -> {
            UserDTO dto = modelMapper.map(u, UserDTO.class);
            dto.setPassword(null);
            return dto;
        }).toList();
    }

    public UserDTO getUserById(Long id) throws Exception {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
        UserDTO dto = modelMapper.map(user, UserDTO.class);
        dto.setPassword(null);
        return dto;
    }

    public UserDTO getUserByEmail(String email) throws Exception {
        if (email == null || email.trim().isEmpty())
            throw new Exception("Email is required");
        User user = userRepo.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new Exception("User not found with email: " + email));
        UserDTO dto = modelMapper.map(user, UserDTO.class);
        dto.setPassword(null);
        return dto;
    }

    public UserDTO updateUser(Long id, UserDTO dto) throws Exception {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));

        if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty())
            throw new Exception("First name cannot be empty");
        if (dto.getLastName() == null || dto.getLastName().trim().isEmpty())
            throw new Exception("Last name cannot be empty");

        user.setFirstName(dto.getFirstName().trim());
        user.setLastName(dto.getLastName().trim());
        if (dto.getPhone()   != null) user.setPhone(dto.getPhone().trim());
        if (dto.getCity()    != null) user.setCity(dto.getCity().trim());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress().trim());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isEmpty())
                throw new Exception("Current password is required to set a new password");
            if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword()))
                throw new Exception("Current password is incorrect");
            if (dto.getPassword().length() < 6)
                throw new Exception("New password must be at least 6 characters");
            if (dto.getConfirmPassword() != null && !dto.getPassword().equals(dto.getConfirmPassword()))
                throw new Exception("Passwords do not match");
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        UserDTO result = modelMapper.map(userRepo.save(user), UserDTO.class);
        result.setPassword(null);
        return result;
    }

    public void deleteUser(Long id) throws Exception {
        if (!userRepo.existsById(id))
            throw new Exception("User not found with ID: " + id);
        userRepo.deleteById(id);
    }

    public List<UserDTO> getUsersByCity(String city) throws Exception {
        if (city == null || city.trim().isEmpty())
            throw new Exception("City is required");
        return userRepo.findByCity(city.trim()).stream().map(u -> {
            UserDTO dto = modelMapper.map(u, UserDTO.class);
            dto.setPassword(null);
            return dto;
        }).toList();
    }
}