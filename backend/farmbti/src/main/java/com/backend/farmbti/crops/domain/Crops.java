package com.backend.farmbti.crops.domain;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "crops")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Crops {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crops_id")
    private Long id;

    @Column(nullable = false, name = "crops_name")
    private String name;

    @Column(name = "crops_image")
    private String cropsImage;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "total_price", nullable = false)
    private double totalPrice;

    @Column(name = "operating_price", nullable = false)
    private double operatingPrice;

    @Column(name = "total_real_price", nullable = false)
    private double totalRealPrice;

    @Column(name = "total_rate", nullable = false)
    private float totalRate;

    @Column(nullable = false)
    private boolean house;

    @Column(name = "monthly_price", columnDefinition = "jsonb")
    private String monthlyPrice;


}
