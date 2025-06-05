package com.backend.farmbti.report.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "region_crop")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class RegionCrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_crop_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;

    @Column(name = "region_crop_name", length = 100, nullable = false)
    private String name;

    @Column(name = "rank", nullable = false)
    private Integer rank;
}