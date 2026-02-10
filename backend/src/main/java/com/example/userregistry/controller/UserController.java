package com.example.userregistry.controller;

import com.example.userregistry.dto.AddressDTO;
import com.example.userregistry.dto.UserDTO;
import com.example.userregistry.dto.UserRegistrationDTO;
import com.example.userregistry.model.Address;
import com.example.userregistry.model.User;
import com.example.userregistry.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(convertUserToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register-user")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        User user = convertToEntity(registrationDTO);
        User savedUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertUserToDTO(savedUser));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRegistrationDTO registrationDTO) {
        try {
            User updatedUser = convertToEntity(registrationDTO);
            User savedUser = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(convertUserToDTO(savedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Helper Methods - Convert Entity <-> DTO

    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setGender(user.getGender());
        dto.setBirthdate(user.getBirthdate());

        // Convert addresses
        List<AddressDTO> addressDTOs = user.getAddresses().stream()
                .map(this::convertAddressToDTO)
                .collect(Collectors.toList());
        dto.setAddresses(addressDTOs);

        return dto;
    }

    private AddressDTO convertAddressToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setAddressType(address.getAddressType());
        dto.setAddressText(address.getAddressText());
        return dto;
    }

    private User convertToEntity(UserRegistrationDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setGender(dto.getGender());
        user.setBirthdate(dto.getBirthdate());

        // If exists, create Address
        if (dto.getWorkAddress() != null && !dto.getWorkAddress().trim().isEmpty()) {
            Address workAddress = new Address();
            workAddress.setAddressType("WORK");
            workAddress.setAddressText(dto.getWorkAddress());
            user.addAddress(workAddress);
        }

        if (dto.getHomeAddress() != null && !dto.getHomeAddress().trim().isEmpty()) {
            Address homeAddress = new Address();
            homeAddress.setAddressType("HOME");
            homeAddress.setAddressText(dto.getHomeAddress());
            user.addAddress(homeAddress);
        }

        return user;
    }
}