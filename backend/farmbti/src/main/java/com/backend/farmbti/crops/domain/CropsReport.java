package com.backend.farmbti.crops.domain;

import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
@Table(name = "crops_report")
public class CropsReport extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crops_result_id")
    private Long id;

    @Column(name = "my_area_volume")
    private double myAreaVolume;

    @Column(name = "my_area_field")
    private double myAreaField;

    @Column(name = "my_total_quantity")
    private double myTotalQuantity;

    @Column(name = "my_total_price")
    private double myTotalPrice;

    @Column(name = "my_total_operating_price")
    private double myTotalOperatingPrice;

    @Column(name = "my_total_real_price")
    private double myTotalRealPrice;

    @Column(name = "my_rate")
    private float myRate;

    @Column(name = "monthly_price", columnDefinition = "jsonb")
    private String monthlyPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crops_id")
    private Crops crops; //crops 테이블과 1:N 단방향 관계

}
