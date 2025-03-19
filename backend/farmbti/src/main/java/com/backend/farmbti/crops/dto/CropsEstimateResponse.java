package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CropsEstimateResponse {

    private Long id;
    private String cropsName;
    private double myAreaVolume;
    private double myAreaField;
    private double myTotalQuantity;
    private double myTotalPrice;
    private double myTotalOperatingPrice;
    private double myTotalRealPrice;
    private float myRate;
    private boolean house;
    private String myMonthlyPrice;
}
