package com.backend.farmbti.news.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NewsResponse {
    private String title;
    private String createdAt;
    private String link;
}
