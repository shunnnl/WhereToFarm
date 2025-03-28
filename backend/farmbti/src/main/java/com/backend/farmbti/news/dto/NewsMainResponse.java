package com.backend.farmbti.news.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class NewsMainResponse {
    private String title;
    private String Image;
    private String link;
}
