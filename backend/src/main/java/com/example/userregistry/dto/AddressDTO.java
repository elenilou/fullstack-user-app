package com.example.userregistry.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long id;
    private String addressType; // "WORK"/"HOME"
    private String addressText;
}
