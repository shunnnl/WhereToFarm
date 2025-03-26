package com.backend.farmbti.report.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ZeppelinClient {

    @Value("${zeppelin.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> getNoteJobStatus(String noteId) {
        String url = baseUrl + "/api/notebook/job/" + noteId;
        String response = restTemplate.getForObject(url, String.class);

        Map<String, String> paragraphStatusMap = new HashMap<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode paragraphs = root.path("body").path("paragraphs");

            if (paragraphs != null && paragraphs.isArray()) {
                for (JsonNode paragraph : paragraphs) {
                    String paragraphId = paragraph.path("id").asText();
                    String status = paragraph.path("status").asText();
                    paragraphStatusMap.put(paragraphId, status);
                }
            } else {
                System.out.println("paragraphs 배열을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return paragraphStatusMap;
    }

    public String getParagraphResult(String noteId, String paragraphId) {
        String url = baseUrl + "/api/notebook/" + noteId + "/paragraph/" + paragraphId;
        return restTemplate.getForObject(url, String.class);
    }

    public void setParagraphParams(String noteId, String paragraphId, Map<String, Object> params) {
        String url = baseUrl + "/api/notebook/" + noteId + "/paragraph/" + paragraphId + "/config";

        Map<String, Object> settings = new HashMap<>();
        settings.put("params", params);

        Map<String, Object> config = new HashMap<>();
        config.put("settings", settings); // 설정을 "settings" 안에 넣어야 한다!

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(config, headers);

        restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
    }


    public void runParagraphWithParams(String noteId, String paragraphId, Map<String, Object> params) {
        String url = baseUrl + "/api/notebook/job/" + noteId + "/" + paragraphId;

        Map<String, Object> payload = new HashMap<>();
        payload.put("params", params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        restTemplate.postForObject(url, entity, String.class);
    }

    public List<String> getParagraphIds(String noteId) {
        String url = baseUrl + "/api/notebook/" + noteId;
        List<String> paragraphIds = new ArrayList<>();

        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode paragraphs = root.path("body").path("paragraphs");

            if (paragraphs.isArray()) {
                for (JsonNode paragraph : paragraphs) {
                    String id = paragraph.path("id").asText();
                    paragraphIds.add(id);
                }
            } else {
                System.out.println("paragraphs 배열을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return paragraphIds;
    }
}
