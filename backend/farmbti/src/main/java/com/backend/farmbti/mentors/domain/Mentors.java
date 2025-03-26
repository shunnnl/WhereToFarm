package com.backend.farmbti.mentors.domain;


import com.backend.farmbti.auth.domain.Users;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "mentors")
public class Mentors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "users_id")
    private Users user;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "farming_years")
    private Integer farmingYears;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}