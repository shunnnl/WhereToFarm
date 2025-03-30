package com.backend.farmbti.property.service;

import com.backend.farmbti.property.dto.KakaoAddressResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoAddressService {

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    private final RestTemplate restTemplate;

    public Map<String, Double> getCoordinatesByAddress(String address) {

        Map<String, Double> coordinates = new HashMap<>();
        coordinates.put("latitude", 0.0);
        coordinates.put("longitude", 0.0);

        try {
            // 1. 주소 인코딩
            String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;

            // 2. 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 3. API 호출 및 응답 확인 (String 타입으로 받아서 로깅)
            ResponseEntity<String> rawResponse = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // 4. 응답 내용 확인 로깅
            log.info("카카오 API 응답: {}", rawResponse.getBody());

            // 5. JSON 파싱 (ObjectMapper 사용)
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(rawResponse.getBody());
            JsonNode documents = rootNode.get("documents");

            if (documents != null && documents.isArray() && documents.size() > 0) {
                JsonNode firstResult = documents.get(0);
                if (firstResult.has("y") && firstResult.has("x")) {
                    double latitude = firstResult.get("y").asDouble();
                    double longitude = firstResult.get("x").asDouble();

                    coordinates.put("latitude", latitude);
                    coordinates.put("longitude", longitude);

                    log.info("좌표 변환 완료: 위도={}, 경도={}", latitude, longitude);
                } else {
                    log.warn("응답에 좌표 정보가 없습니다: {}", firstResult);
                }
            } else {
                log.warn("주소에 대한 검색 결과가 없습니다: {}", address);
            }
        } catch (Exception e) {
            log.error("좌표 변환 중 오류 발생: {}", e.getMessage(), e);
        }

        return coordinates;
    }
}