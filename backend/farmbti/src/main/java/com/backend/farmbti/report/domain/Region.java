package com.backend.farmbti.report.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "region")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")
    private Integer id;

    @Column(name = "region_name", length = 100, nullable = false)
    private String name;

    @Column(name = "basic_info", length = 300, nullable = false)
    private String basicInfo;

    @Column(name = "recommendation_reason", length = 500, nullable = false)
    private String recommendationReason;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL)
    private List<RegionCrop> regionCrops = new ArrayList<>();

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL)
    private List<ReportRegion> reportRegions = new ArrayList<>();
}