package com.backend.farmbti.news.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.news.service.NewsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@Tag(name = "뉴스 컨트롤러", description = "뉴스를 조회하는 컨트롤러")
@Slf4j
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/main")
    @Operation(summary = "메인 뉴스", description = "메인 화면의 뉴스 top3를 불러옵니다.")
    public CommonResponseDto getMainNews() throws UnsupportedEncodingException, JsonProcessingException {
        String keyword = "귀농";
        return CommonResponseDto.ok(newsService.getMainNews(keyword));
    }


    @GetMapping("/list")
    @Operation(summary = "뉴스 목록", description = "뉴스 목록들을 불러옵니다.")
    public CommonResponseDto getList() throws UnsupportedEncodingException, JsonProcessingException {
        String keyword = "귀농";
        return CommonResponseDto.ok(newsService.getNewsList(keyword));
    }


}
