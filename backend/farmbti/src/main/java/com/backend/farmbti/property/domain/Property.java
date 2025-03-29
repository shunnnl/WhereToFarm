package com.backend.farmbti.property.domain;

import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "property")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Property{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long id;

    @Column(name = "detail_address", nullable = false, length = 200)
    private String detailAddress;

    @Column(name = "agency", nullable = false, length = 100)
    private String agency;

    @Column(name = "deposit", nullable = false)
    private Integer deposit;

    @Column(name = "area", nullable = false)
    private Double area;

    @Column(name = "feature", length = 500)
    private String feature;
}