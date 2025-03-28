package com.backend.farmbti.news.controller;

import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.news.service.NewsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@Tag(name = "뉴스 컨트롤러", description = "뉴스를 조회하는 컨트롤러")
@Slf4j
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/news/main")
    public CommonResponseDto getMainNews() {
        String keyword = "귀농";
        return CommonResponseDto.ok(newsService.getMainNews(keyword));
    }


    @GetMapping("/news/list")
    public CommonResponseDto getList() {
        String keyword = "귀농";
        return CommonResponseDto.ok(newsService.getNewsList(keyword));
    }


}
