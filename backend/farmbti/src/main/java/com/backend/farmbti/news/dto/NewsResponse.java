package com.backend.farmbti.news.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Getter
@Builder
public class NewsResponse {
    private String title;
    private String createdAt;
    private Date parsedDate;   // Date 객체 (정렬용)
    private String link;
}
