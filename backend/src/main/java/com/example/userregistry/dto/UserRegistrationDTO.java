package com.example.userregistry.dto;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Surname")
    private String surname;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "[MF]", message =  "Gender must be M or F")
    private String gender;

    @NotNull(message = "Birthdate is required")
    private LocalDate birthdate;

    private String workAddress;
    private String homeAddress;


}
