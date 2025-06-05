package com.backend.farmbti.report.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReportListResponseDto {
    private Integer reportId;
    private LocalDateTime createdAt;
    private String characterTypeName;
    private String topRegionName; // 랭크 1인 지역 이름만 포함
}