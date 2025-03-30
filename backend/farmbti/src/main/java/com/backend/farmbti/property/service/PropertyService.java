package com.backend.farmbti.property.service;

import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.property.domain.Property;
import com.backend.farmbti.property.dto.PropertyDetailResponse;
import com.backend.farmbti.property.dto.PropertyListResponse;
import com.backend.farmbti.property.dto.PropertySearchRequest;
import com.backend.farmbti.property.exception.PropertyErrorCode;
import com.backend.farmbti.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final KakaoAddressService kakaoAddressService;

    /**
     * 모든 부동산 매물 조회
     */
    @Transactional(readOnly = true)
    public List<PropertyListResponse> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();

        return properties.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }

    /**
     * 검색 조건에 따른 부동산 매물 조회
     */
    @Transactional(readOnly = true)
    public List<PropertyListResponse> searchProperties(PropertySearchRequest request) {
        List<Property> searchResults;

        if (request.getDo_() != null && !request.getDo_().trim().isEmpty() &&
                request.getCity() != null && !request.getCity().trim().isEmpty()) {
            // 도와 시/군 모두 제공된 경우
            searchResults = propertyRepository.findByAddressContainingDoAndCity(request.getDo_(), request.getCity());
        } else if (request.getDo_() != null && !request.getDo_().trim().isEmpty()) {
            // 도만 제공된 경우
            searchResults = propertyRepository.findByAddressContainingDo(request.getDo_());
        } else if (request.getCity() != null && !request.getCity().trim().isEmpty()) {
            // 시/군만 제공된 경우
            searchResults = propertyRepository.findByAddressContainingCity(request.getCity());
        } else {
            // 검색 조건이 없는 경우 전체 조회
            searchResults = propertyRepository.findAll();
        }

        return searchResults.stream()
                .map(this::convertToListResponse)
                .collect(Collectors.toList());
    }


    /**
     * 특정 매물 상세 조회 (좌표 정보 포함)
     */
    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyDetail(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> {
                    return new GlobalException(PropertyErrorCode.PROPERTY_NOT_FOUND);
                });

        // 주소를 좌표로 변환
        Map<String, Double> coordinates = kakaoAddressService.getCoordinatesByAddress(property.getDetailAddress());

        // 매물 정보와 좌표 정보를 함께 반환
        return PropertyDetailResponse.builder()
                .id(property.getId())
                .address(property.getDetailAddress())
                .agency(property.getAgency())
                .deposit(property.getDeposit())
                .area(property.getArea())
                .feature(property.getFeature())
                .latitude(coordinates.get("latitude"))
                .longitude(coordinates.get("longitude"))
                .build();
    }



    /**
     * Entity를 리스트 응답 DTO로 변환
     */
    private PropertyListResponse convertToListResponse(Property property) {
        return PropertyListResponse.builder()
                .id(property.getId())
                .address(property.getDetailAddress())
                .agency(property.getAgency())
                .deposit(property.getDeposit())
                .area(property.getArea())
                .feature(property.getFeature())
                .build();
    }

}