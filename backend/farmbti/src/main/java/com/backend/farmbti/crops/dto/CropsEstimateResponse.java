package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CropsEstimateResponse {

    private Long id;
    private double myAreaVolume;
    private double myAreaField;
    private double myTotalQuantity;
    private double myTotalOperatingPrice;
    private double myTotalRealPrice;
    private float myRate;
    private String monthlyPrice;
    private String cropsName;

}
