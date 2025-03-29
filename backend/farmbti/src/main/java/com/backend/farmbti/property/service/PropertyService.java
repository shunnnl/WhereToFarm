package com.backend.farmbti.property.service;

import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.property.domain.Property;
import com.backend.farmbti.property.dto.PropertyListResponse;
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
        log.info("조회된 매물 수: {}", properties.size());

        return properties.stream()
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