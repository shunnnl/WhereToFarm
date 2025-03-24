package com.backend.farmbti.zeppelin.controller;

import com.backend.farmbti.zeppelin.dto.ZeppelinRequestDto;
import com.backend.farmbti.zeppelin.service.ZeppelinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/zeppelin")
@Tag(name = "Zeppelin 컨트롤러", description = "Zeppelin 노트 실행, 결과 조회, 특정 정보 전달하는 등 Zeppelin 관리하는 컨트롤러")
public class ZeppelinController {
    private final ZeppelinService zeppelinService;

    public ZeppelinController(ZeppelinService zeppelinService) {
        this.zeppelinService = zeppelinService;
    }

    @Operation(
            summary = "전체 paragraph에서 파라미터 적용 및 note 실행",
            description = "Zeppelin 노트북의 모든 paragraph에 파라미터를 적용하고 순차적으로 실행한 후, 마지막 paragraph의 결과를 반환합니다. 각 paragraph는 필요한 파라미터만 사용합니다."
    )
    @PostMapping("/run-notebook-with-params-for-all/{noteId}")
    public ResponseEntity<String> runNotebookWithParamsForLast(
            @PathVariable String noteId,
            @RequestBody ZeppelinRequestDto requestDto
    ) throws InterruptedException {
        String result = zeppelinService.runNotebookWithParamsForAll(noteId, requestDto.getParams());
        return ResponseEntity.ok(result);
    }

}
