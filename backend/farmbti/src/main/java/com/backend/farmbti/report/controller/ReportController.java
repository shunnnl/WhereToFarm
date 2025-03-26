package com.backend.farmbti.report.controller;

import com.backend.farmbti.report.dto.ZeppelinRequestDto;
import com.backend.farmbti.report.service.ZeppelinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import com.backend.farmbti.common.dto.CommonResponseDto;

import java.util.List;

@RestController
@RequestMapping("/zeppelin")
@Tag(name = "Report 컨트롤러", description = "Report 관련 컨트롤러")
public class ReportController {
    private final ZeppelinService zeppelinService;

    public ReportController(ZeppelinService zeppelinService) {
        this.zeppelinService = zeppelinService;
    }

    @Operation(
            summary = "전체 paragraph에서 파라미터 적용 및 note 실행",
            description = "Zeppelin 노트북의 모든 paragraph에 파라미터를 적용하고 순차적으로 실행한 후, 마지막 paragraph의 결과를 반환합니다. 각 paragraph는 필요한 파라미터만 사용합니다."
    )
    @PostMapping("/run-notebook-with-params-for-all/{noteId}")
    public CommonResponseDto<List<String>> runNotebookWithParamsForLast(
            @PathVariable String noteId,
            @RequestBody ZeppelinRequestDto requestDto
    ) throws InterruptedException {
        String raw = zeppelinService.runNotebookWithParamsForAll(noteId, requestDto.getParams());
        List<String> regionList = zeppelinService.extractTopRegions(raw); // 지역 리스트만 뽑아옴
        return CommonResponseDto.ok(regionList);
    }


}
