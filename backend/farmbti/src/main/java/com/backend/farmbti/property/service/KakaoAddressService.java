package com.backend.farmbti.property.service;

import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.property.exception.MapErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
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
        // 주소 유효성 검사
        if (address == null || address.trim().isEmpty()) {
            throw new GlobalException(MapErrorCode.INVALID_ADDRESS_FORMAT);
        }

        try {
            String url = "https://dapi.kakao.com/v2/local/search/address.json?query=" + address;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> rawResponse;
            try {
                rawResponse = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        entity,
                        String.class
                );
            } catch (Exception e) {
                throw new GlobalException(MapErrorCode.KAKAO_API_ERROR);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode;
            try {
                rootNode = objectMapper.readTree(rawResponse.getBody());
            } catch (Exception e) {
                throw new GlobalException(MapErrorCode.COORDINATE_PARSING_ERROR);
            }

            JsonNode documents = rootNode.get("documents");
            if (documents == null || !documents.isArray() || documents.size() == 0) {
                throw new GlobalException(MapErrorCode.ADDRESS_NOT_FOUND);
            }

            JsonNode firstResult = documents.get(0);
            if (!firstResult.has("y") || !firstResult.has("x")) {
                throw new GlobalException(MapErrorCode.COORDINATE_PARSING_ERROR);
            }

            double latitude = firstResult.get("y").asDouble();
            double longitude = firstResult.get("x").asDouble();

            log.info("좌표 변환 완료: 위도={}, 경도={}", latitude, longitude);

            Map<String, Double> coordinates = new HashMap<>();
            coordinates.put("latitude", latitude);
            coordinates.put("longitude", longitude);

            return coordinates;

        } catch (Exception e) {
            log.error("좌표 변환 중 예상치 못한 오류 발생: {}", e.getMessage());
            throw new GlobalException(MapErrorCode.KAKAO_API_ERROR);
        }
    }
}