package com.backend.farmbti.users.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.users.dto.CurrentUserResponse;
import com.backend.farmbti.users.dto.PasswordChangeRequest;
import com.backend.farmbti.users.dto.UserDeleteRequest;
import com.backend.farmbti.users.dto.UserUpdateRequest;
import com.backend.farmbti.users.exception.UsersErrorCode;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 비밀번호 변경
     */
    @Transactional
    public void changePassword(PasswordChangeRequest request, Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new GlobalException(UsersErrorCode.PASSWORD_MISMATCH);
        }

        // 새 비밀번호 암호화 및 업데이트
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedNewPassword);

        usersRepository.save(user);
    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    public void deleteUser(UserDeleteRequest request, Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new GlobalException(UsersErrorCode.PASSWORD_MISMATCH);
        }

        // 회원 삭제
        usersRepository.delete(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    public void updateUserInfo(UserUpdateRequest request, Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 입력값 검증
        validateUserUpdateRequest(request);

        // 회원 정보 업데이트
        user.updateUserInfo(request.getName(), request.getBirth(), request.getAddress(), request.getGender());

        usersRepository.save(user);
    }


    /**
     * 현재 로그인한 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public CurrentUserResponse getCurrentUserInfo(Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        return new CurrentUserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAddress(),
                user.getBirth(),
                user.getGender(),
                user.getProfileImage()
        );
    }

    /**
     * 사용자 업데이트 요청 검증 메소드
     */
    private void validateUserUpdateRequest(UserUpdateRequest request) {
        // 이름 검증
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_NAME);
        }

        // 주소 검증
        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_ADDRESS);
        }

        // 생년월일 검증
        if (request.getBirth() == null) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_BIRTH);
        }

        // 성별 검증
        if (request.getGender() == null) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_GENDER);
        }
    }

}