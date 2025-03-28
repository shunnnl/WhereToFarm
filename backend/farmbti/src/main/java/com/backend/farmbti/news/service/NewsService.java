package com.backend.farmbti.news.service;

import com.backend.farmbti.news.config.NaverApiConfig;
import com.backend.farmbti.news.config.WebClientConfig;
import com.backend.farmbti.news.dto.NewsMainResponse;
import com.backend.farmbti.news.dto.NewsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
@Slf4j
@RequiredArgsConstructor
public class NewsService {

    private final NaverApiConfig naverApiConfig;
    private final WebClientConfig webClient;

    public NewsMainResponse getMainNews(String keyword) {

        URI uri = UriComponentsBuilder.
                fromUriString(naverApiConfig.newsUrl)
                //호출할 url 세팅
                .queryParam("query", keyword)
                .queryParam("display", 20)
                .queryParam("start", 1)
                .queryParam("sort", "date")
                // 파라미터가 4개, 쿼리 디스플레이 스타트 솔트
                .build()
                .encode() // 한글은 인코딩이 필요
                .toUri(); //uri 경로, 파라미터들이 들어가있음

        NewsResponse naverNewsResponse = webClient.get()
                //http 메소드먼저 씀 get post put delete
                .uri(uri)
                .retrieve()
                .bodyToMono(NewsResponse.class)
                //NaverNewsResponse.class : 응답을 NaverNewsResponse 클래스로 받겠다
                .block();
        // naverNewsResponse 에 담아온 데이터를 가공하여 제공 newsSearchResponse
        NewsResponse newsSearchResponse = new NewsResponse();
        newsSearchResponse.setTotalCount(naverNewsResponse.getTotal());
        newsSearchResponse.setArticles(naverNewsResponse.getItems());
        return newsSearchResponse;
        //헤더세팅은 이미 컨피그에서 되어있음
    }


    public NewsResponse getNewsList(String keyword) {


    }
}
