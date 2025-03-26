package com.backend.farmbti.mentors.domain;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "mentors")
public class Mentors extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentors_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "users_id")
    private Users user;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Column(name = "farming_years")
    private Integer farmingYears;

    public void updateMentorInfo(String bio, Integer farmingYears) {
        this.bio = bio;
        this.farmingYears = farmingYears;
    }
}