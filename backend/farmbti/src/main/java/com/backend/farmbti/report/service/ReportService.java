package com.backend.farmbti.report.service;

import com.backend.farmbti.report.domain.CharacterType;
import com.backend.farmbti.report.repository.CharacterTypeRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.report.domain.Region;
import com.backend.farmbti.report.repository.RegionRepository;
import com.backend.farmbti.report.domain.Report;
import com.backend.farmbti.report.domain.ReportRegion;
import com.backend.farmbti.report.dto.ReportResponseDto;
import com.backend.farmbti.report.exception.ReportErrorCode;
import com.backend.farmbti.report.repository.ReportRegionRepository;
import com.backend.farmbti.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportRegionRepository reportRegionRepository;
    private final RegionRepository regionRepository;
    private final CharacterTypeRepository characterTypeRepository;

    /**
     * 지역 목록과 FARM 파라미터를 기반으로 리포트 생성
     */
    @Transactional
    public ReportResponseDto createReport(List<String> regionNames, Map<String, Object> params) {
        try {
            if (regionNames == null || regionNames.isEmpty()) {
                throw new GlobalException(ReportErrorCode.EMPTY_RESULT);
            }

            // 1. Report 엔티티 생성 및 저장
            CharacterType characterType = determineCharacterType(params);

            // FARM 값 추출
            Float fValue = convertToFloat(params.get("F"));
            Float aValue = convertToFloat(params.get("A"));
            Float rValue = convertToFloat(params.get("R"));
            Float mValue = convertToFloat(params.get("M"));

            Report report = Report.builder()
                    .characterType(characterType)
                    .fRatio(fValue)
                    .sRatio(aValue) // A가 S를 의미
                    .nRatio(rValue) // R이 N을 의미
                    .pRatio(mValue) // M이 P를 의미
                    .scoreId(1) // 기본값 또는 필요에 따라 설정
                    .build();

            Report savedReport = reportRepository.save(report);
            log.info("Created report with ID: {}", savedReport.getId());

            // 2. 상위 3개 지역에 대한 ReportRegion 생성 및 저장
            List<ReportResponseDto.RegionResultDto> regionResults = new ArrayList<>();

            for (int i = 0; i < regionNames.size() && i < 3; i++) {
                String regionName = regionNames.get(i);

                // 지역 조회
                Region region = regionRepository.findByName(regionName)
                        .orElseThrow(() -> new GlobalException(ReportErrorCode.REGION_NOT_FOUND));

                // ReportRegion 저장
                ReportRegion reportRegion = ReportRegion.builder()
                        .report(savedReport)
                        .region(region)
                        .rank(i + 1) // 1, 2, 3 순위
                        .build();

                reportRegionRepository.save(reportRegion);
                log.info("Created report region with rank {} for region: {}", i + 1, regionName);

                // 지역 작물 정보 매핑
                List<ReportResponseDto.CropResultDto> cropResults = region.getRegionCrops().stream()
                        .map(crop -> ReportResponseDto.CropResultDto.builder()
                                .rank(crop.getRank())
                                .cropName(crop.getName())
                                .build())
                        .collect(Collectors.toList());

                // 지역 결과 DTO 생성
                ReportResponseDto.RegionResultDto regionResult = ReportResponseDto.RegionResultDto.builder()
                        .rank(i + 1)
                        .regionName(region.getName())
                        .basicInfo(region.getBasicInfo())
                        .recommendationReason(region.getRecommendationReason())
                        .topCrops(cropResults)
                        .build();

                regionResults.add(regionResult);
            }

            // 3. 최종 응답 DTO 생성
            return ReportResponseDto.builder()
                    .reportId(savedReport.getId())
                    .createdAt(savedReport.getCreatedAt())
                    .fRatio(savedReport.getFRatio())
                    .aRatio(savedReport.getSRatio())
                    .rRatio(savedReport.getNRatio())
                    .mRatio(savedReport.getPRatio())
                    .characterTypeName(characterType.getName())
                    .characterTypeDescription(characterType.getDescription())
                    .characterTypeImage(characterType.getImage())
                    .topRegions(regionResults)
                    .build();

        } catch (GlobalException e) {
            log.error("Error during report creation", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during report creation", e);
            throw new GlobalException(ReportErrorCode.REPORT_CREATION_FAILED);
        }
    }

    /**
     * 리포트 ID로 리포트 조회
     */
    @Transactional(readOnly = true)
    public ReportResponseDto getReportById(Integer reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new GlobalException(ReportErrorCode.REPORT_NOT_FOUND));

        CharacterType characterType = report.getCharacterType();

        // 지역 결과 목록 구성
        List<ReportResponseDto.RegionResultDto> regionResults = report.getReportRegions().stream()
                .sorted((r1, r2) -> r1.getRank().compareTo(r2.getRank()))
                .map(reportRegion -> {
                    Region region = reportRegion.getRegion();

                    // 작물 정보 매핑
                    List<ReportResponseDto.CropResultDto> cropResults = region.getRegionCrops().stream()
                            .map(crop -> ReportResponseDto.CropResultDto.builder()
                                    .rank(crop.getRank())
                                    .cropName(crop.getName())
                                    .build())
                            .collect(Collectors.toList());

                    return ReportResponseDto.RegionResultDto.builder()
                            .rank(reportRegion.getRank())
                            .regionName(region.getName())
                            .basicInfo(region.getBasicInfo())
                            .recommendationReason(region.getRecommendationReason())
                            .topCrops(cropResults)
                            .build();
                })
                .collect(Collectors.toList());

        return ReportResponseDto.builder()
                .reportId(report.getId())
                .createdAt(report.getCreatedAt())
                .fRatio(report.getFRatio())
                .aRatio(report.getSRatio())
                .rRatio(report.getNRatio())
                .mRatio(report.getPRatio())
                .characterTypeName(characterType.getName())
                .characterTypeDescription(characterType.getDescription())
                .characterTypeImage(characterType.getImage())
                .topRegions(regionResults)
                .build();
    }

    /**
     * Object를 Float으로 변환 (Map에서 받은 값 처리용)
     */
    private Float convertToFloat(Object value) {
        if (value == null) {
            return 0.0f;
        }

        if (value instanceof Number) {
            return ((Number) value).floatValue();
        }

        try {
            return Float.parseFloat(value.toString());
        } catch (NumberFormatException e) {
            return 0.0f;
        }
    }

    /**
     * 파라미터를 바탕으로 성격 유형 결정
     */
    private CharacterType determineCharacterType(Map<String, Object> params) {
        // FARM 값을 기준으로 성격 유형 결정 로직
        // 예: FARM 값을 조합하여 가장 적합한 캐릭터 유형 선택

        // 여기서는 간단한 로직으로 구현 (실제로는 복잡한 비즈니스 로직이 필요할 수 있음)
        Float fValue = convertToFloat(params.get("F"));
        Float aValue = convertToFloat(params.get("A"));
        Float rValue = convertToFloat(params.get("R"));
        Float mValue = convertToFloat(params.get("M"));

        // 가장 높은 값을 기준으로 성격 유형 결정 (예시)
        int characterTypeId = 1; // 기본값

        if (fValue >= aValue && fValue >= rValue && fValue >= mValue) {
            characterTypeId = 1; // F 유형
        } else if (aValue >= fValue && aValue >= rValue && aValue >= mValue) {
            characterTypeId = 2; // A 유형
        } else if (rValue >= fValue && rValue >= aValue && rValue >= mValue) {
            characterTypeId = 3; // R 유형
        } else if (mValue >= fValue && mValue >= aValue && mValue >= rValue) {
            characterTypeId = 4; // M 유형
        }

        return characterTypeRepository.findById(characterTypeId)
                .orElseThrow(() -> new GlobalException(ReportErrorCode.CHARACTER_TYPE_NOT_FOUND));
    }
}