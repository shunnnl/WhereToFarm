package com.backend.farmbti.news.service;

import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.news.config.NaverApiConfig;
import com.backend.farmbti.news.dto.NewsMainResponse;
import com.backend.farmbti.news.dto.NewsResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsService {

    private final NaverApiConfig naverApiConfig;
    private final S3Service s3Service;

    ObjectMapper objectMapper = new ObjectMapper();

    private static String get(String apiUrl, Map<String, String> requestHeaders) {
        HttpURLConnection con = connect(apiUrl);
        try {
            con.setRequestMethod("GET");
            for (Map.Entry<String, String> header : requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }


            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) { // 정상 호출
                return readBody(con.getInputStream());
            } else { // 오류 발생
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect();
        }
    }

    private static HttpURLConnection connect(String apiUrl) {
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection) url.openConnection();
        } catch (MalformedURLException e) {
            throw new RuntimeException("API URL이 잘못되었습니다. : " + apiUrl, e);
        } catch (IOException e) {
            throw new RuntimeException("연결이 실패했습니다. : " + apiUrl, e);
        }
    }


    private static String readBody(InputStream body) {
        InputStreamReader streamReader = new InputStreamReader(body);


        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();


            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }


            return responseBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답을 읽는 데 실패했습니다.", e);
        }
    }

    public List<NewsMainResponse> getMainNews(String keyword) throws UnsupportedEncodingException, JsonProcessingException {

        String word = URLEncoder.encode(keyword, "UTF-8");

        String apiURL = naverApiConfig.newsUrl + "?query=" + word + "&display=3&start=1&sort=sim";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", naverApiConfig.clientId);
        requestHeaders.put("X-Naver-Client-Secret", naverApiConfig.clientSecret);
        String result = get(apiURL, requestHeaders);

        JsonNode rootNode = objectMapper.readTree(result);

        log.debug("Root JSON node: {}", rootNode);

        JsonNode itemsNode = rootNode.get("items");

        List<NewsMainResponse> newsList = new ArrayList<>();

        for (JsonNode item : itemsNode) {
            String title = cleanHtmlTags(item.get("title").asText());
            String link = item.get("link").asText();
            String image = null;

            NewsMainResponse newsMainResponse = NewsMainResponse.builder()
                    .title(title)
                    .link(link)
                    .Image(image)
                    .build();

            newsList.add(newsMainResponse);

        }

        return newsList;
    }

    private String cleanHtmlTags(String text) {
        return text.replaceAll("<[^>]*>", "");
    }

    public List<NewsResponse> getNewsList(String keyword) throws UnsupportedEncodingException, JsonProcessingException {

        String word = URLEncoder.encode(keyword, "UTF-8");

        String apiURL = naverApiConfig.newsUrl + "?query=" + word + "&display=100&start=1&sort=sim";

        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", naverApiConfig.clientId);
        requestHeaders.put("X-Naver-Client-Secret", naverApiConfig.clientSecret);
        String result = get(apiURL, requestHeaders);

        JsonNode rootNode = objectMapper.readTree(result);

        log.debug("Root JSON node: {}", rootNode);

        JsonNode itemsNode = rootNode.get("items");

        List<NewsResponse> newsList = new ArrayList<>();

        for (JsonNode item : itemsNode) {
            String title = cleanHtmlTags(item.get("title").asText());
            String link = item.get("link").asText();
            String createdAt = item.get("pubDate").asText();

            NewsResponse newsResponse = NewsResponse.builder()
                    .title(title)
                    .link(link)
                    .createdAt(createdAt)
                    .build();

            newsList.add(newsResponse);

        }

        return newsList;

    }
}
