package com.backend.farmbti.mentors.domain;

import com.backend.farmbti.crops.domain.Crops;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "mentors_crops")
public class MentorsCrops {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentors_crops_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mentors_id")
    private Mentors mentor;

    @ManyToOne
    @JoinColumn(name = "crops_id")
    private Crops crop;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}