package com.backend.farmbti.mentors.exception;

import com.backend.farmbti.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MentorsErrorCode implements ErrorCode {

    ALREADY_REGISTERED_AS_MENTOR(400, "이미 멘토로 등록된 사용자입니다."),
    INVALID_MENTOR_INFO(400, "자기소개는 필수 항목입니다."),
    INVALID_FARMING_YEARS(400, "영농 시작 년도는 필수 항목입니다."),
    MENTOR_NOT_FOUND(404, "해당 멘토를 찾을 수 없습니다."),
    INVALID_LOCATION_PARAMETER(400, "지역 정보는 필수입니다."),
    NO_MENTORS_IN_LOCATION(404, "해당 지역에 등록된 멘토가 없습니다."),
    MENTOR_REGISTRATION_FAILED(500, "멘토 등록 중 오류가 발생했습니다."),
    MENTOR_UPDATE_FAILED(500, "멘토 정보 수정 중 오류가 발생했습니다."),
    MENTOR_CROP_RELATION_FAILED(500, "멘토와 작물 관계 설정 중 오류가 발생했습니다."),
    MENTOR_CROP_VALIDATION_FAILED(400, "멘토의 작물 정보 검증에 실패했습니다."),
    MENTOR_LOCATION_SEARCH_FAILED(500, "지역 기반 멘토 검색 중 오류가 발생했습니다.");

    private final int status;
    private final String message;

    @Override
    public String code() {
        return name();
    }
}