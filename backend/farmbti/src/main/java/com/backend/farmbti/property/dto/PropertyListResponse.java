package com.backend.farmbti.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyListResponse {
    private Long id;
    private String address;
    private String agency;
    private Integer deposit;
    private Double area;
    private String feature;
    private String formattedDeposit; // "1억 400만원" 형식
}