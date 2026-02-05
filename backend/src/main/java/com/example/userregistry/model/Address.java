package com.example.userregistry.model;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition =  "TEXT")
    private String addressText;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
