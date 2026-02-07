package com.example.userregistry.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String surname;
    private String gender;
    private LocalDate birthdate;
    private List<AddressDTO> addresses = new ArrayList<>();
}
