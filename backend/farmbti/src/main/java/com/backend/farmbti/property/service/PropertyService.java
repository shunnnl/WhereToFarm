package com.backend.farmbti.property.service;

import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.property.domain.Property;
import com.backend.farmbti.property.dto.PropertyListResponse;
import com.backend.farmbti.property.dto.PropertySearchRequest;
import com.backend.farmbti.property.exception.PropertyErrorCode;
import com.backend.farmbti.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;

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