package com.backend.farmbti.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Data  // getter, setter, toString 등 자동 생성
public class SignUpRequest {

    @NotBlank(message = "이메일은 필수입니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "주소는 필수입니다")
    private String address;

    @NotNull(message = "성별은 필수입니다")
    private Byte gender;

    @NotNull(message = "생년월일은 필수입니다")
    private Date birth;
}
