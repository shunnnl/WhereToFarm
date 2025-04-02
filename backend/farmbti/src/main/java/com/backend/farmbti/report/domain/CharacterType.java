package com.backend.farmbti.report.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "character_type")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class CharacterType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "character_id")
    private Integer id;

    @Column(name = "character_name", length = 100, nullable = false)
    private String name;

    @Column(name = "character_subtitle", length = 100, nullable = false)
    private String subtitle;

    @Column(name = "character_description", length = 255, nullable = false)
    private String description;

    @Column(name = "character_image", length = 255, nullable = false)
    private String image;

    @OneToMany(mappedBy = "characterType", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();
}