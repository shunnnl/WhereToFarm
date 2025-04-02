package com.backend.farmbti.report.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.policy.domain.Policy;
import com.backend.farmbti.policy.repository.PolicyRepository;
import com.backend.farmbti.report.domain.CharacterType;
import com.backend.farmbti.report.domain.Region;
import com.backend.farmbti.report.domain.Report;
import com.backend.farmbti.report.domain.ReportRegion;
import com.backend.farmbti.report.dto.ReportListResponseDto;
import com.backend.farmbti.report.dto.ReportResponseDto;
import com.backend.farmbti.report.exception.ReportErrorCode;
import com.backend.farmbti.report.repository.CharacterTypeRepository;
import com.backend.farmbti.report.repository.RegionRepository;
import com.backend.farmbti.report.repository.ReportRegionRepository;
import com.backend.farmbti.report.repository.ReportRepository;
import com.backend.farmbti.security.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
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
    private final PolicyRepository policyRepository;
    private final UsersRepository usersRepository;
    private final S3Service s3Service;
    private final SecurityUtils securityUtils;

    /**
     * 지역 목록과 FARM 파라미터를 기반으로 리포트 생성
     */
    @Transactional
    public ReportResponseDto createReport(List<String> regionNames, Map<String, Object> params) {
        try {
            if (regionNames == null || regionNames.isEmpty()) {
                throw new GlobalException(ReportErrorCode.EMPTY_RESULT);
            }

            // 현재 로그인한 사용자 ID 가져오기
            Long userId = securityUtils.getCurrentUsersId();

            // 사용자 정보 조회
            Users currentUser = usersRepository.findById(userId)
                    .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

            // 1. Report 엔티티 생성 및 저장
            CharacterType characterType = determineCharacterType(params);

            // FARM 값 추출
            Float fValue = convertToFloat(params.get("F"));
            Float aValue = convertToFloat(params.get("A"));
            Float rValue = convertToFloat(params.get("R"));
            Float mValue = convertToFloat(params.get("M"));

            Report report = Report.builder()
                    .user(currentUser)
                    .characterType(characterType)
                    .fRatio(fValue)
                    .sRatio(aValue) // A가 S를 의미
                    .nRatio(rValue) // R이 N을 의미
                    .pRatio(mValue) // M이 P를 의미
                    .build();

            Report savedReport = reportRepository.save(report);

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

                // 지역 작물 정보 매핑
                List<ReportResponseDto.CropResultDto> cropResults = region.getRegionCrops().stream()
                        .map(crop -> ReportResponseDto.CropResultDto.builder()
                                .rank(crop.getRank())
                                .cropName(crop.getName())
                                .build())
                        .collect(Collectors.toList());

                // 지역 관련 정책 검색
                List<Policy> regionPolicies = policyRepository.findAllByRegionContaining(region.getName());

                List<ReportResponseDto.PolicyDto> policyDtos = regionPolicies.stream()
                        .map(policy -> ReportResponseDto.PolicyDto.builder()
                                .id(policy.getId())
                                .region(policy.getRegion())
                                .registrationDate(policy.getRegistrationDate())
                                .title(policy.getTitle())
                                .description(policy.getDescription())
                                .target(policy.getTarget())
                                .support(policy.getSupport())
                                .build())
                        .collect(Collectors.toList());

                // 지역 결과 DTO 생성
                ReportResponseDto.RegionResultDto regionResult = ReportResponseDto.RegionResultDto.builder()
                        .rank(i + 1)
                        .regionName(region.getName())
                        .basicInfo(region.getBasicInfo())
                        .recommendationReason(region.getRecommendationReason())
                        .topCrops(cropResults)
                        .policies(policyDtos)
                        .build();

                regionResults.add(regionResult);
            }

            // 캐릭터 이미지의 Signed URL 생성
            String characterImagePath = characterType.getImage();
            String characterImageUrl = s3Service.getSignedUrl(characterImagePath);

            // 3. 최종 응답 DTO 생성
            return ReportResponseDto.builder()
                    .reportId(savedReport.getId())
                    .createdAt(savedReport.getCreatedAt())
                    .fRatio(savedReport.getFRatio())
                    .aRatio(savedReport.getSRatio())
                    .rRatio(savedReport.getNRatio())
                    .mRatio(savedReport.getPRatio())
                    .characterTypeName(characterType.getName())
                    .characterSubtitle(characterType.getSubtitle())
                    .characterTypeDescription(characterType.getDescription())
                    .characterTypeImage(characterImageUrl)
                    .topRegions(regionResults)
                    .build();

        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(ReportErrorCode.REPORT_CREATION_FAILED);
        }
    }

    /**
     * 현재 로그인한 사용자의 리포트 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ReportListResponseDto> getMyReports() {
        // 현재 로그인한 사용자 ID 가져오기
        Long userId = securityUtils.getCurrentUsersId();

        // 사용자의 리포트 조회
        List<Report> reports = reportRepository.findByUserId(userId);

        return reports.stream()
                .map(report -> {
                    // 랭크 1인 지역 이름 추출
                    String topRegionName = report.getReportRegions().stream()
                            .filter(rr -> rr.getRank() == 1)
                            .findFirst()
                            .map(rr -> rr.getRegion().getName())
                            .orElse(""); // 지역이 없는 경우 빈 문자열 반환

                    return ReportListResponseDto.builder()
                            .reportId(report.getId())
                            .createdAt(report.getCreatedAt())
                            .characterTypeName(report.getCharacterType().getName())
                            .topRegionName(topRegionName)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 리포트 상세 조회
     */
    @Transactional(readOnly = true)
    public ReportResponseDto getReportDetail(Integer reportId) {
        // 리포트 조회
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new GlobalException(ReportErrorCode.REPORT_NOT_FOUND));

        // 요청한 사용자가 리포트 소유자인지 확인 (선택적)
        Long currentUserId = securityUtils.getCurrentUsersId();
        if (!report.getUser().getId().equals(currentUserId)) {
            throw new GlobalException(ReportErrorCode.ACCESS_DENIED);
        }

        CharacterType characterType = report.getCharacterType();

        // 캐릭터 이미지의 Signed URL 생성
        String characterImagePath = characterType.getImage();
        String characterImageUrl = s3Service.getSignedUrl(characterImagePath);

        // 지역 결과 목록 구성
        List<ReportResponseDto.RegionResultDto> regionResults = report.getReportRegions().stream()
                .sorted(Comparator.comparing(ReportRegion::getRank))
                .map(reportRegion -> {
                    Region region = reportRegion.getRegion();

                    // 작물 정보 매핑
                    List<ReportResponseDto.CropResultDto> cropResults = region.getRegionCrops().stream()
                            .map(crop -> ReportResponseDto.CropResultDto.builder()
                                    .rank(crop.getRank())
                                    .cropName(crop.getName())
                                    .build())
                            .collect(Collectors.toList());

                    // 지역 관련 정책 검색
                    List<Policy> regionPolicies = policyRepository.findAllByRegionContaining(region.getName());
                    List<ReportResponseDto.PolicyDto> policyDtos = regionPolicies.stream()
                            .map(policy -> ReportResponseDto.PolicyDto.builder()
                                    .id(policy.getId())
                                    .region(policy.getRegion())
                                    .registrationDate(policy.getRegistrationDate())
                                    .title(policy.getTitle())
                                    .description(policy.getDescription())
                                    .target(policy.getTarget())
                                    .support(policy.getSupport())
                                    .build())
                            .collect(Collectors.toList());

                    return ReportResponseDto.RegionResultDto.builder()
                            .rank(reportRegion.getRank())
                            .regionName(region.getName())
                            .basicInfo(region.getBasicInfo())
                            .recommendationReason(region.getRecommendationReason())
                            .topCrops(cropResults)
                            .policies(policyDtos)
                            .build();
                })
                .collect(Collectors.toList());

        // 응답 DTO 구성
        return ReportResponseDto.builder()
                .reportId(report.getId())
                .createdAt(report.getCreatedAt())
                .fRatio(report.getFRatio())
                .aRatio(report.getSRatio())
                .rRatio(report.getNRatio())
                .mRatio(report.getPRatio())
                .characterTypeName(characterType.getName())
                .characterSubtitle(characterType.getSubtitle())
                .characterTypeDescription(characterType.getDescription())
                .characterTypeImage(characterImageUrl)
                .topRegions(regionResults)
                .build();
    }

    /**
     * 리포트 삭제
     */
    @Transactional
    public void deleteReport(Integer reportId) {
        // 리포트 조회
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new GlobalException(ReportErrorCode.REPORT_NOT_FOUND));

        // 본인 리포트인지 확인
        Long currentUserId = securityUtils.getCurrentUsersId();
        if (!report.getUser().getId().equals(currentUserId)) {
            throw new GlobalException(ReportErrorCode.ACCESS_DENIED);
        }

        // 리포트 삭제
        reportRepository.delete(report);
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
        // FARM 값을 추출
        Float fValue = convertToFloat(params.get("F"));
        Float aValue = convertToFloat(params.get("A"));
        Float rValue = convertToFloat(params.get("R"));
        Float mValue = convertToFloat(params.get("M"));

        // 0.6을 기준으로 high/low 결정
        boolean isHighF = fValue >= 0.6;
        boolean isHighA = aValue >= 0.6;
        boolean isHighR = rValue >= 0.6;
        boolean isHighM = mValue >= 0.6;

        // 유형 ID 계산 (1~16)
        int characterTypeId = 1;

        if (isHighF && isHighA && isHighR && isHighM) characterTypeId = 1;
        else if (isHighF && isHighA && isHighR && !isHighM) characterTypeId = 2;
        else if (isHighF && isHighA && !isHighR && isHighM) characterTypeId = 3;
        else if (isHighF && isHighA && !isHighR && !isHighM) characterTypeId = 4;
        else if (isHighF && !isHighA && isHighR && isHighM) characterTypeId = 5;
        else if (isHighF && !isHighA && isHighR && !isHighM) characterTypeId = 6;
        else if (isHighF && !isHighA && !isHighR && isHighM) characterTypeId = 7;
        else if (isHighF && !isHighA && !isHighR && !isHighM) characterTypeId = 8;
        else if (!isHighF && isHighA && isHighR && isHighM) characterTypeId = 9;
        else if (!isHighF && isHighA && isHighR && !isHighM) characterTypeId = 10;
        else if (!isHighF && isHighA && !isHighR && isHighM) characterTypeId = 11;
        else if (!isHighF && isHighA && !isHighR && !isHighM) characterTypeId = 12;
        else if (!isHighF && !isHighA && isHighR && isHighM) characterTypeId = 13;
        else if (!isHighF && !isHighA && isHighR && !isHighM) characterTypeId = 14;
        else if (!isHighF && !isHighA && !isHighR && isHighM) characterTypeId = 15;
        else if (!isHighF && !isHighA && !isHighR && !isHighM) characterTypeId = 16;

        log.info("Character determination: F={}, A={}, R={}, M={}, Selected characterTypeId={}",
                fValue, aValue, rValue, mValue, characterTypeId);

        return characterTypeRepository.findById(characterTypeId)
                .orElseThrow(() -> new GlobalException(ReportErrorCode.CHARACTER_TYPE_NOT_FOUND));
    }
}