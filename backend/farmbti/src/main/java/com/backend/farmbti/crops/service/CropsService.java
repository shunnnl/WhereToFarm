package com.backend.farmbti.crops.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.crops.domain.Crops;
import com.backend.farmbti.crops.domain.CropsReport;
import com.backend.farmbti.crops.dto.CropsEstimateRequest;
import com.backend.farmbti.crops.dto.CropsEstimateResponse;
import com.backend.farmbti.crops.exception.CropsErrorCode;
import com.backend.farmbti.crops.repository.CropsReportRepository;
import com.backend.farmbti.crops.repository.CropsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CropsService {

    private final UsersRepository usersRepository;
    private final CropsRepository cropsRepository;
    private final CropsReportRepository cropsReportRepository;

    public CropsEstimateResponse estimate(CropsEstimateRequest request, Long id) {

        //1. 유저 확인
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));
        log.info("받은 평수: " + request.getMyAreaVolume());

        //2. 받은 평수에 대한 평수에 대한 면적값 계산
        double areaField = request.getMyAreaVolume() * 3.3058d;
        log.info("받은 평수에 대한 지역 면적 계산 : " + areaField);

        //3. 총 수확량 계산
        Crops crops = cropsRepository.findByName(request.getCropsName())
                .orElseThrow(() -> new GlobalException(CropsErrorCode.CROPS_NOT_FOUND));
        double quantity = request.getMyAreaVolume() * crops.getQuantity();


        //4. 연간 총 매출액, 연간 총 경영비, 연간 에상 순 수익, 수익률 계산
        double totalPrice = request.getMyAreaVolume() * crops.getTotalPrice();
        double operatingPrice = request.getMyAreaVolume() * crops.getOperatingPrice();
        double realPrice = totalPrice - operatingPrice;
        float rate = (float) (realPrice / totalPrice) * 100;

        //5. 월별 예상 매출액 그래프
        

        //6. db 저장 (예상 수익 그래프 넣기)
        CropsReport cropsReport = CropsReport.builder()
                .myAreaVolume(request.getMyAreaVolume())
                .myAreaField(areaField)
                .myTotalQuantity(quantity)
                .myTotalPrice(totalPrice)
                .myTotalOperatingPrice(operatingPrice)
                .myTotalRealPrice(realPrice)
                .myRate(rate)
                .build();

        cropsReportRepository.save(cropsReport);

        return CropsEstimateResponse.builder()
                .id(cropsReport.getId())
                .cropsName(request.getCropsName())
                .myAreaVolume(request.getMyAreaVolume())
                .myAreaField(areaField)
                .myTotalQuantity(quantity)
                .myTotalPrice(totalPrice)
                .myTotalOperatingPrice(operatingPrice)
                .myTotalRealPrice(realPrice)
                .myRate(rate)
                .build();
    }
}
