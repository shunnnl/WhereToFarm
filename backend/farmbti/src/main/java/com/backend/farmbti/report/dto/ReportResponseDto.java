package com.backend.farmbti.report.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReportResponseDto {
    private Integer reportId;
    private LocalDateTime createdAt;
    private Float fRatio;
    private Float aRatio;
    private Float rRatio;
    private Float mRatio;
    private String characterTypeName;
    private String characterTypeDescription;
    private String characterTypeImage;
    private List<RegionResultDto> topRegions;

    @Getter
    @Builder
    public static class RegionResultDto {
        private Integer rank;
        private String regionName;
        private String basicInfo;
        private String recommendationReason;
        private List<CropResultDto> topCrops;
    }

    @Getter
    @Builder
    public static class CropResultDto {
        private Integer rank;
        private String cropName;
    }
}