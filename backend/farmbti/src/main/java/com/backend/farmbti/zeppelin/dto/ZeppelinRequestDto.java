package com.backend.farmbti.zeppelin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Schema(description = "Zeppelin 실행 시 전달할 파라미터 DTO")
public class ZeppelinRequestDto {
    @Schema(description = "Zeppelin 노트에서 사용할 파라미터", example = "{\"region\": \"대구\", \"temp\": 35.5}")
    private Map<String, Object> params;
}
