package com.backend.farmbti.property.service;

import com.backend.farmbti.common.dto.PageResponseDto;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.property.domain.Property;
import com.backend.farmbti.property.dto.PropertyDetailResponse;
import com.backend.farmbti.property.dto.PropertyListResponse;
import com.backend.farmbti.property.dto.PropertySearchRequest;
import com.backend.farmbti.property.exception.PropertyErrorCode;
import com.backend.farmbti.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final KakaoAddressService kakaoAddressService;

    /**
     * 모든 부동산 매물 조회
     */
    public PageResponseDto<PropertyListResponse> getAllProperties(Pageable pageable) {
        try {
            Page<Property> page = propertyRepository.findAll(pageable);
            Page<PropertyListResponse> mapped = page.map(this::convertToListResponse);
            return new PageResponseDto<>(mapped);
        } catch (Exception e) {
            throw new GlobalException(PropertyErrorCode.PROPERTY_SEARCH_FAILED);
        }
    }

    /**
     * 검색 조건에 따른 부동산 매물 조회 (페이지네이션 적용)
     */
    @Transactional(readOnly = true)
    public PageResponseDto<PropertyListResponse> searchPropertiesWithPage(
            PropertySearchRequest request,
            Pageable pageable
    ) {
        try {
            validateSearchRequest(request);

            Page<Property> searchResults = findPropertiesBySearchCriteria(request, pageable);

            Page<PropertyListResponse> mappedResults = searchResults.map(this::convertToListResponse);

            return new PageResponseDto<>(mappedResults);
        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(PropertyErrorCode.PROPERTY_SEARCH_FAILED);
        }
    }

    /**
     * 검색 요청 유효성 검증
     */
    private void validateSearchRequest(PropertySearchRequest request) {
        if (request == null) {
            throw new GlobalException(PropertyErrorCode.INVALID_SEARCH_PARAMETER);
        }
    }

    /**
     * 검색 조건에 따른 매물 조회 로직
     */
    private Page<Property> findPropertiesBySearchCriteria(
            PropertySearchRequest request,
            Pageable pageable
    ) {
        if (isValidSearchCriteria(request.getDo_(), request.getCity())) {
            return propertyRepository.findByAddressContainingDoAndCityWithPage(
                    request.getDo_(),
                    request.getCity(),
                    pageable
            );
        } else if (isValidSearchCriteria(request.getDo_())) {
            return propertyRepository.findByAddressContainingDoWithPage(
                    request.getDo_(),
                    pageable
            );
        } else if (isValidSearchCriteria(request.getCity())) {
            return propertyRepository.findByAddressContainingCityWithPage(
                    request.getCity(),
                    pageable
            );
        } else {
            return propertyRepository.findAll(pageable);
        }
    }

    /**
     * 검색 조건 유효성 확인
     */
    private boolean isValidSearchCriteria(String... criteria) {
        return Arrays.stream(criteria)
                .anyMatch(criterion ->
                        criterion != null && !criterion.trim().isEmpty()
                );
    }

    /**
     * 특정 매물 상세 조회 (좌표 정보 포함)
     */
    @Transactional(readOnly = true)
    public PropertyDetailResponse getPropertyDetail(Long id) {
        try {
            Property property = findPropertyById(id);
            Map<String, Double> coordinates = getCoordinatesByAddress(property.getDetailAddress());

            return buildPropertyDetailResponse(property, coordinates);
        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(PropertyErrorCode.PROPERTY_SEARCH_FAILED);
        }
    }

    /**
     * ID로 매물 조회
     */
    private Property findPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new GlobalException(PropertyErrorCode.PROPERTY_NOT_FOUND));
    }

    /**
     * 주소를 좌표로 변환
     */
    private Map<String, Double> getCoordinatesByAddress(String address) {
        try {
            return kakaoAddressService.getCoordinatesByAddress(address);
        } catch (Exception e) {
            throw new GlobalException(PropertyErrorCode.PROPERTY_COORDINATE_ERROR);
        }
    }

    /**
     * 매물 상세 응답 빌더
     */
    private PropertyDetailResponse buildPropertyDetailResponse(
            Property property,
            Map<String, Double> coordinates
    ) {
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