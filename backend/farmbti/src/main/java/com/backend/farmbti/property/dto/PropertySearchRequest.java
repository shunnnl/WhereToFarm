package com.backend.farmbti.property.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchRequest {
    private String do_; // 도 이름
    private String city; // 시/군 이름
}