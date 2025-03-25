package com.backend.farmbti.users.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.users.dto.PasswordChangeRequest;
import com.backend.farmbti.users.dto.UserDeleteRequest;
import com.backend.farmbti.users.exception.UsersErrorCode;
import jakarta.transaction.Transactional;
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
        // 사용자 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new GlobalException(UsersErrorCode.PASSWORD_MISMATCH);
        }

        // 회원 삭제
        usersRepository.delete(user);
    }

}