package com.backend.farmbti.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDetailResponse {
    private Long id;
    private String address;
    private String agency;
    private Integer deposit;
    private Double area;
    private String feature;

    // 좌표 정보 추가
    private Double latitude;
    private Double longitude;
}