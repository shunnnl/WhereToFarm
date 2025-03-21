package com.backend.farmbti.crops.dto;

import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class CropsEstimateRequest {

    private double myAreaVolume;
    private String cropsName;

}
