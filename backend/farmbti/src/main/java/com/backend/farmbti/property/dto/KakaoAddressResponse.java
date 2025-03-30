package com.backend.farmbti.property.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class KakaoAddressResponse {
    private List<Documents> documents;
    private Meta meta;

    @Getter
    @Setter
    public static class Documents {
        private String address_name;
        private String y;  // 위도 (latitude)
        private String x;  // 경도 (longitude)
        private Address address;
        private RoadAddress road_address;
    }

    @Getter
    @Setter
    public static class Address {
        private String address_name;
        private String region_1depth_name;
        private String region_2depth_name;
        private String region_3depth_name;
    }

    @Getter
    @Setter
    public static class RoadAddress {
        private String address_name;
        private String region_1depth_name;
        private String region_2depth_name;
        private String region_3depth_name;
    }

    @Getter
    @Setter
    public static class Meta {
        private int total_count;
    }
}