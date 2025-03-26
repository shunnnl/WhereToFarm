package com.backend.farmbti.mentors.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MentorRegisterRequest {

    @NotBlank(message = "자기소개는 필수입니다.")
    private String bio;

    @NotNull(message = "영농 시작 년도는 필수입니다.")
    private Integer farmingYears;

    @NotEmpty(message = "최소 하나 이상의 작물을 선택해야 합니다.")
    private List<String> cropNames;
}