package com.example.userregistry.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(name ="address_type", nullable = false)
    private String addressType; // WORK or HOME

    @Column(name ="address_text",columnDefinition =  "TEXT")
    private String addressText;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
}
