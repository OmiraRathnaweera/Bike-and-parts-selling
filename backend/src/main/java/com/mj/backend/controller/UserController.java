package com.mj.backend.controller;

import com.mj.backend.config.JwtUtils;
import com.mj.backend.dto.ResponseDTO;
import com.mj.backend.dto.UserDTO;
import com.mj.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody UserDTO dto) {
        try {
            UserDTO created = userService.registerUser(dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ResponseDTO.success("Registration successful", created));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    //  Login
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody Map<String, String> body) {
        try {
            String email    = body.get("email");
            String password = body.get("password");
            UserDTO user = userService.loginUser(email, password);

            String token = jwtUtils.generateToken(user.getEmail());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("user", user);
            responseData.put("token", token);

            return ResponseEntity.ok(ResponseDTO.success("Login successful", responseData));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Get all
    @GetMapping
    public ResponseEntity<ResponseDTO> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsers();
            return ResponseEntity.ok(ResponseDTO.success("Users fetched", users));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(ResponseDTO.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Get by email
    @GetMapping("/email/{email}")
    public ResponseEntity<ResponseDTO> getUserByEmail(@PathVariable String email) {
        try {
            UserDTO user = userService.getUserByEmail(email);
            return ResponseEntity.ok(ResponseDTO.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO dto) {
        try {
            UserDTO updated = userService.updateUser(id, dto);
            return ResponseEntity.ok(ResponseDTO.success("Profile updated", updated));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(ResponseDTO.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }

    // Get by city
    @GetMapping("/city/{city}")
    public ResponseEntity<ResponseDTO> getUsersByCity(@PathVariable String city) {
        try {
            List<UserDTO> users = userService.getUsersByCity(city);
            return ResponseEntity.ok(ResponseDTO.success("Users in " + city, users));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDTO.error(e.getMessage()));
        }
    }
}