package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CropsEstimateResponse {

    private Long reportId;
    private String cropsName;
    private double myAreaVolume;
    private double myAreaField;
    private double myTotalQuantity;
    private double myTotalPrice;
    private double myTotalOperatingPrice;
    private double myTotalRealPrice;
    private float myRate;
    private boolean house;
    private Object myMonthlyPrice;
    private Object myPastPrice;
}
