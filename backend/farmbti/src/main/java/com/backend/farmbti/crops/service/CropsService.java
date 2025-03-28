package com.backend.farmbti.crops.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.crops.domain.Crops;
import com.backend.farmbti.crops.domain.CropsReport;
import com.backend.farmbti.crops.dto.CropsAllResponse;
import com.backend.farmbti.crops.dto.CropsDetailReponse;
import com.backend.farmbti.crops.dto.CropsEstimateRequest;
import com.backend.farmbti.crops.dto.CropsEstimateResponse;
import com.backend.farmbti.crops.exception.CropsErrorCode;
import com.backend.farmbti.crops.exception.CropsReportErrorCode;
import com.backend.farmbti.crops.repository.CropsReportRepository;
import com.backend.farmbti.crops.repository.CropsRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CropsService {

    private final UsersRepository usersRepository;
    private final CropsRepository cropsRepository;
    private final CropsReportRepository cropsReportRepository;
    private final ObjectMapper objectMapper;

    public CropsEstimateResponse estimate(CropsEstimateRequest request, Long userId) throws JsonProcessingException {

        // 1. 사용자 조회
        Users users = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        log.info("받은 평수: " + request.getMyAreaVolume());

        // 2. 받은 평수에 대한 면적값 계산
        double areaField = request.getMyAreaVolume() * 3.3058d;
        log.info("받은 평수에 대한 지역 면적 계산 : " + areaField);

        Crops crops = cropsRepository.findByName(request.getCropsName())
                .orElseThrow(() -> new GlobalException(CropsErrorCode.CROPS_NOT_FOUND));

        // 3. 총 수확량 계산
        double quantity = (areaField / 1000) * crops.getQuantity();
        log.info("총 수확량 계산: " + quantity + " kg");

        // 4. 연간 총 매출액, 연간 총 경영비, 연간 에상 순 수익, 수익률 계산
        double totalPrice = (areaField / 1000) * crops.getTotalPrice();
        double operatingPrice = (areaField / 1000) * crops.getOperatingPrice();
        double realPrice = totalPrice - operatingPrice;
        float rate = crops.getTotalRate();

        // 5. 월별 예상 매출액 그래프
        String monthlyPrice = crops.getMonthlyPrice(); // JSON 문자열

        // 월별 과거 그래프
        String pastPrice = crops.getPastPrice();

        // 6. db 저장 (예상 수익 그래프 넣기)
        CropsReport cropsReport = CropsReport.builder()
                .myAreaVolume(request.getMyAreaVolume())
                .myAreaField(areaField)
                .myTotalQuantity(quantity)
                .myTotalPrice(totalPrice)
                .myTotalOperatingPrice(operatingPrice)
                .myTotalRealPrice(realPrice)
                .myRate(rate)
                .crops(crops)  // crops 관계 설정
                .users(users)   // users 관계 설정
                .build();

        cropsReportRepository.save(cropsReport);

        // monthlyPrice JSON 문자열을 파싱하여 객체로 변환
        Object parsedMonthlyPrice = objectMapper.readValue(monthlyPrice, Object.class);

        // pastPrice JSON 문자열을 파싱하여 객체로 변환
        Object parsedPastPrice = objectMapper.readValue(pastPrice, Object.class);

        return CropsEstimateResponse.builder()
                .reportId(cropsReport.getId())  // 저장 후 생성된 ID 사용
                .cropsName(request.getCropsName())
                .myAreaVolume(request.getMyAreaVolume())
                .myAreaField(areaField)
                .myTotalQuantity(quantity)
                .myTotalPrice(totalPrice)
                .myTotalOperatingPrice(operatingPrice)
                .myTotalRealPrice(realPrice)
                .myRate(rate)
                .house(crops.isHouse())
                .myMonthlyPrice(parsedMonthlyPrice)
                .myPastPrice(parsedPastPrice)
                .build();
    }

    public void bookmarkCrops(Long usersId, Long reportId) {
        // 사용자 확인
        Users users = usersRepository.findById(usersId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 이미 저장된 report 찾기
        CropsReport report = cropsReportRepository.findById(reportId)
                .orElseThrow(() -> new GlobalException(CropsReportErrorCode.REPORT_NOT_FOUND));

        // 북마크 상태 변경
        report.bookmark();

        cropsReportRepository.save(report);

    }

    public void delete(Long usersId, Long reportId) {
        // 사용자 확인
        Users users = usersRepository.findById(usersId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 리포트 존재하는지 확인
        CropsReport cropsReport = cropsReportRepository.findById(reportId)
                .orElseThrow(() -> new GlobalException(CropsReportErrorCode.REPORT_NOT_FOUND));

        //리포트 삭제
        cropsReportRepository.deleteById(reportId);

    }

    @Transactional(readOnly = true)
    public List<CropsAllResponse> getCrops(Long usersId) {

        //userId에 해당하는 모든 리포트 객체를 리스트로 가져옴
        List<CropsReport> cropsReport = cropsReportRepository.findByUsersIdAndBookmarkedTrue(usersId);

        //결과를 담을 리스트를 생성
        List<CropsAllResponse> responses = new ArrayList<>();

        //CropsReport 형의
        for (CropsReport report : cropsReport) {
            // 작물 정보 가져오기 (사용자의 report에서 crops 객체 참조)
            Crops crops = report.getCrops();
            responses.add(CropsAllResponse.builder()
                    .cropsName(crops.getName())
                    .myAreaVolume(report.getMyAreaVolume())
                    .myTotalPrice(report.getMyTotalPrice())
                    .createdAt(report.getCreatedAt())
                    .build());
        }

        return responses;
    }

    public CropsDetailReponse getCropsDetail(Long usersId, Long cropsReportId) throws JsonProcessingException {

        CropsReport cropsReport = cropsReportRepository.findByUsers_IdAndId(usersId, cropsReportId)
                .orElseThrow(() -> new GlobalException(CropsReportErrorCode.REPORT_NOT_FOUND));

        Crops crops = cropsReport.getCrops();

        String monthlyPrice = crops.getMonthlyPrice(); // JSON 문자열

        // monthlyPrice JSON 문자열을 파싱하여 객체로 변환
        Object parsedMonthlyPrice = objectMapper.readValue(monthlyPrice, Object.class);


        String pastPrice = crops.getPastPrice(); // JSON 문자열

        // monthlyPrice JSON 문자열을 파싱하여 객체로 변환
        Object parsedPastPrice = objectMapper.readValue(pastPrice, Object.class);

        return CropsDetailReponse.builder()
                .cropsName(crops.getName())
                .myAreaVolume(cropsReport.getMyAreaVolume())
                .myAreaField(cropsReport.getMyAreaField())
                .myTotalQuantity(cropsReport.getMyTotalQuantity())
                .myTotalPrice(cropsReport.getMyTotalPrice())
                .myTotalOperatingPrice(cropsReport.getMyTotalOperatingPrice())
                .myTotalRealPrice(cropsReport.getMyTotalRealPrice())
                .myRate(cropsReport.getMyRate())
                .myMonthlyPrice(parsedMonthlyPrice)
                .myPastPrice(parsedPastPrice)
                .house(crops.isHouse())
                .build();
    }
}
