package com.backend.farmbti.report.controller;

import com.backend.farmbti.report.dto.ReportResponseDto;
import com.backend.farmbti.report.dto.ZeppelinRequestDto;
import com.backend.farmbti.report.service.ReportService;
import com.backend.farmbti.report.service.ZeppelinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.backend.farmbti.common.dto.CommonResponseDto;

import java.util.List;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
@Tag(name = "Report 컨트롤러", description = "Report 관련 컨트롤러")
public class ReportController {
    private final ZeppelinService zeppelinService;
    private final ReportService reportService;

    @Operation(
            summary = "Zeppelin 노트북 실행 및 리포트 생성",
            description = "Zeppelin 노트북을 실행하고 결과로 나온 지역 정보를 바탕으로 리포트를 생성합니다."
    )
    @PostMapping("/create/{noteId}")
    public CommonResponseDto<ReportResponseDto> runNotebookWithParamsForLast(
            @PathVariable String noteId,
            @RequestBody ZeppelinRequestDto requestDto
    ) throws InterruptedException {
        // 1. Zeppelin 서비스로 노트북 실행 및 지역 목록 추출
        String raw = zeppelinService.runNotebookWithParamsForAll(noteId, requestDto.getParams());
        List<String> regionList = zeppelinService.extractTopRegions(raw); // 지역 리스트만 뽑아옴

        // 2. 추출된 지역 목록을 ReportService로 전달하여 리포트 생성
        ReportResponseDto reportResponse = reportService.createReport(regionList, requestDto.getParams());

        return CommonResponseDto.ok(reportResponse);
    }

}
