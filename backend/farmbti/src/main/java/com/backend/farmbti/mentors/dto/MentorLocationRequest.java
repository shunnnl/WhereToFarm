package com.backend.farmbti.mentors.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MentorLocationRequest {
    private String doName;
    private String cityName;
}