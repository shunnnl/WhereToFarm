package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CropsAllResponse {
    private Long reportId;
    private String cropsName;
    private double myAreaVolume;
    private LocalDateTime createdAt;
    private double myTotalPrice;
}
