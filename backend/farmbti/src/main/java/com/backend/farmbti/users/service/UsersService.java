package com.backend.farmbti.users.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.mentors.domain.Mentors;
import com.backend.farmbti.mentors.domain.MentorsCrops;
import com.backend.farmbti.mentors.repository.MentorsCropsRepository;
import com.backend.farmbti.mentors.repository.MentorsRepository;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final MentorsRepository mentorsRepository;  // 멘토 리포지토리 추가
    private final MentorsCropsRepository mentorsCropsRepository;  // 멘토-작물 리포지토리 추가
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;

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

        // 1. 멘토로 등록되어 있는지 확인
        Optional<Mentors> mentorOptional = mentorsRepository.findByUserId(userId);

        // 2. 멘토인 경우, 멘토-작물 관계 삭제 후 멘토 정보 삭제
        if (mentorOptional.isPresent()) {
            Mentors mentor = mentorOptional.get();
            // 2-1. 먼저 멘토-작물 관계 삭제
            mentorsCropsRepository.deleteByMentorId(mentor.getId());
            // 2-2. 그 다음 멘토 정보 삭제
            mentorsRepository.delete(mentor);
        }

        // 3. 마지막으로 사용자 정보 삭제
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

        if (user.getProfileImage().startsWith("basic/") && !request.getGender().equals(user.getGender())) {
            // 새로운 성별에 맞는 기본 프로필 이미지로 변경
            String newDefaultProfileImageKey = s3Service.getDefaultProfileImageKey(request.getGender());
            user.updateProfileImage(newDefaultProfileImageKey);
        }

        // 회원 정보 업데이트
        user.updateUserInfo(request.getName(), request.getBirth(), request.getAddress(), request.getGender());

        usersRepository.save(user);
    }


    /**
     * 현재 로그인한 사용자 정보 조회 (멘토 정보 포함)
     */
    @Transactional(readOnly = true)
    public CurrentUserResponse getCurrentUserInfo(Long userId) {
        // 1. 사용자 기본 정보 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 프로필 이미지 S3 객체 키 (예: "basic/male.jpg", "uploads/1/abc.jpg")
        String profileImageKey = user.getProfileImage();

        String profileImageUrl;
        try {
            profileImageUrl = s3Service.getSignedUrl(profileImageKey);
        } catch (Exception e) {
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }

        boolean isDefaultImage = profileImageKey.startsWith("basic/");

        CurrentUserResponse.CurrentUserResponseBuilder builder = CurrentUserResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .address(user.getAddress())
                .birth(user.getBirth())
                .gender(user.getGender())
                .profileImage(profileImageUrl)
                .isDefaultImage(isDefaultImage);

        // 2. 사용자의 멘토 정보 조회
        Optional<Mentors> mentorOptional = mentorsRepository.findByUserId(userId);

        // 3. 멘토인 경우 추가 정보 설정
        if (mentorOptional.isPresent()) {
            Mentors mentor = mentorOptional.get();

            // 멘토가 키우는 작물 조회
            List<MentorsCrops> mentorsCrops = mentorsCropsRepository.findByMentorId(mentor.getId());
            List<String> cropNames = mentorsCrops.stream()
                    .map(mc -> mc.getCrop().getName())
                    .collect(Collectors.toList());

            builder.isMentor(true)
                    .mentorId(mentor.getId())
                    .bio(mentor.getBio())
                    .farmingYears(mentor.getFarmingYears())
                    .cropNames(cropNames);
        }

        return builder.build();
    }

    /**
     * 기본 프로필 이미지로 변경
     */
    @Transactional
    public void resetToDefaultProfileImage(Long userId) {
        // 1. 사용자 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 2. 기본 이미지 키 생성
        String defaultProfileImageKey = s3Service.getDefaultProfileImageKey(user.getGender());

        // 3. 이전 이미지 삭제 (기본 이미지가 아닌 경우)
        if (!user.getProfileImage().startsWith("basic/")) {
            s3Service.deleteFile(user.getProfileImage());
        }

        // 4. 프로필 이미지 업데이트
        user.updateProfileImage(defaultProfileImageKey);
        usersRepository.save(user);
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