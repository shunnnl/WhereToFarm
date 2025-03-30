package com.backend.farmbti.news.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NaverApiConfig {
    @Value("${naver.api.client-id}")
    //yml 파일에 있는 naver.api.client-id 값을 가져옴
    public String clientId;
    @Value("${naver.api.client-secret}")
    public String clientSecret;
    @Value("${naver.api.url}")
    public String newsUrl;

}
