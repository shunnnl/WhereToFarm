package com.backend.farmbti.report.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "report")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterType characterType;

    @Column(name = "score_id", nullable = false)
    private Integer scoreId;

    @Column(name = "f_ratio", nullable = false)
    private Float fRatio;

    @Column(name = "s_ratio", nullable = false)
    private Float sRatio;

    @Column(name = "n_ratio", nullable = false)
    private Float nRatio;

    @Column(name = "p_ratio", nullable = false)
    private Float pRatio;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<ReportRegion> reportRegions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}