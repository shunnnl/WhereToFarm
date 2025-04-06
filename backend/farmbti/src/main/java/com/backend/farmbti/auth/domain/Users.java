package com.backend.farmbti.auth.domain;

import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 접근 제한 설정 (JPA 요구사항)
public class Users extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "users_id")
    private Long id;
    //private: 객체의 데이터를 외부에서 직접 접근하지 못하게 하고, 대신 메소드를 통해 접근

    @Column(nullable = false, length = 50) // NULL 불가, 최대 길이 50, 중복 방지
    private String email;

    @Column(nullable = false, length = 100) // NULL 불가, 최대 길이 100
    private String password;

    @Column(nullable = false, length = 10) // NULL 불가, 최대 길이 30
    private String name;

    @Column(nullable = false)
    private Date birth;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private byte gender;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl; // ImageUrl 속도 빨리!!!

    @Column(name = "profile_image_url_expires_at")
    private LocalDateTime profileImageUrlExpiresAt;

//    @Enumerated(EnumType.STRING) //데이터베이스에서 직접 값을 볼 때 "ROLE_USER"로 읽힘
//    @Column(nullable = false)
//    private Role role;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Builder.Default
    @Column(name = "is_out", nullable = false)
    private Byte isOut = 0; // 탈퇴여부: 탈퇴(1), 탈퇴X(0)

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void updatePassword(String newPassword) {
        this.password = newPassword;
    }

    public void updateProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public void updateIsOut(Byte isOut) {
        this.isOut = isOut;
    }

    public void updateUserInfo(String name, Date birth, String address, Byte gender) {
        this.name = name;
        this.birth = birth;
        this.address = address;
        this.gender = gender;
    }

    // URL 관련 메서드
    public void updateProfileImageUrl(String url, LocalDateTime expiresAt) {
        this.profileImageUrl = url;
        this.profileImageUrlExpiresAt = expiresAt;
    }

    public boolean isProfileImageUrlExpired() {
        return profileImageUrlExpiresAt == null ||
                LocalDateTime.now().isAfter(profileImageUrlExpiresAt);
    }

//    public enum Role {
//        MENTEE,
//        MENTOR
//    }

}
