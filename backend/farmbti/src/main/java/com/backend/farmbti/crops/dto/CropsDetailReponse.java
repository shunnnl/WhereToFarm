package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CropsDetailReponse {
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
}
