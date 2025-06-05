package com.backend.farmbti.report.domain;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "report")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Report extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id")  // users 테이블의 PK와 연결할 외래키 컬럼명 지정
    private Users user;  // Users 엔티티와의 관계 설정

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = false)
    private CharacterType characterType;

    @Column(name = "f_ratio", nullable = false)
    private Float fRatio;

    @Column(name = "s_ratio", nullable = false)
    private Float sRatio;

    @Column(name = "n_ratio", nullable = false)
    private Float nRatio;

    @Column(name = "p_ratio", nullable = false)
    private Float pRatio;

    @Builder.Default
    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<ReportRegion> reportRegions = new ArrayList<>();

}