package com.backend.farmbti.users.service;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.exception.S3ErrorCode;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.mentors.domain.Mentors;
import com.backend.farmbti.mentors.domain.MentorsCrops;
import com.backend.farmbti.mentors.exception.MentorsCropsErrorCode;
import com.backend.farmbti.mentors.exception.MentorsErrorCode;
import com.backend.farmbti.mentors.repository.MentorsCropsRepository;
import com.backend.farmbti.mentors.repository.MentorsRepository;
import com.backend.farmbti.redis.RedisService;
import com.backend.farmbti.users.dto.*;
import com.backend.farmbti.users.exception.UsersErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersService {

    private final UsersRepository usersRepository;
    private final MentorsRepository mentorsRepository;
    private final MentorsCropsRepository mentorsCropsRepository;
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;
    private final RedisService redisService;

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

        // 새 비밀번호가 현재 비밀번호와 동일한지 확인
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new GlobalException(UsersErrorCode.NEW_PASSWORD_SAME_AS_CURRENT);
        }

        // 비밀번호 복잡성 검증
        validatePasswordComplexity(request.getNewPassword());

        // 새 비밀번호 암호화 및 업데이트
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.updatePassword(encodedNewPassword);

        usersRepository.save(user);
    }

    /**
     * 회원 탈퇴 (논리적 삭제)
     */
    @Transactional
    public void deleteUser(UserDeleteRequest request, Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 이미 탈퇴한 회원인지 확인
        if (user.getIsOut() == 1) {
            throw new GlobalException(UsersErrorCode.ALREADY_DELETED_USER);
        }

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new GlobalException(UsersErrorCode.PASSWORD_MISMATCH);
        }

        user.updateRefreshToken(null); // 리프레쉬토큰 null로 처리

        // URL 관련 정보 초기화
        user.updateProfileImageUrl(null, null);

        // 사용자 상태를 탈퇴(1)로 변경
        user.updateIsOut((byte) 1);

        // 변경사항 저장
        usersRepository.save(user);
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    public CurrentUserResponse updateUserInfo(UserUpdateRequest request, Long userId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 탈퇴한 회원인지 확인
        if (user.getIsOut() == 1) {
            throw new GlobalException(UsersErrorCode.ALREADY_DELETED_USER);
        }

        // 입력값 검증
        validateUserUpdateRequest(request);

        // 유효하지 않은 생년월일 검증 (예: 미래 날짜)
        if (request.getBirth() != null && request.getBirth().after(new Date())) {
            throw new GlobalException(UsersErrorCode.INVALID_BIRTH_DATE_FUTURE);
        }

        // 기본 프로필 이미지를 사용 중이고 성별이 변경된 경우
        if (user.getProfileImage() != null &&
                user.getProfileImage().startsWith("basic/") &&
                !request.getGender().equals(user.getGender())) {
            try {
                // 새로운 성별에 맞는 기본 프로필 이미지로 변경
                String newDefaultProfileImageKey = s3Service.getDefaultProfileImageKey(request.getGender());

                // 기본 이미지 키가 null인 경우
                if (newDefaultProfileImageKey == null) {
                    throw new GlobalException(S3ErrorCode.DEFAULT_PROFILE_IMAGE_NOT_FOUND);
                }

                user.updateProfileImage(newDefaultProfileImageKey);

                // URL 정보 초기화 (성별이 바뀌면 이미지가 바뀌므로)
                user.updateProfileImageUrl(null, null);

            } catch (AmazonS3Exception s3e) {
                throw new GlobalException(S3ErrorCode.S3_SERVICE_ERROR);
            } catch (Exception e) {
                throw new GlobalException(S3ErrorCode.S3_SERVICE_ERROR);
            }
        }

        // 회원 정보 업데이트
        user.updateUserInfo(request.getName(), request.getBirth(), request.getAddress(), request.getGender());

        usersRepository.save(user);

        // 변경된 정보 기반으로 최신 유저 정보 응답
        return getCurrentUserInfo(userId);
    }


    /**
     * 현재 로그인한 사용자 정보 조회 (멘토 정보 포함)
     */
    @Transactional // readOnly 제거: URL 저장 필요함
    public CurrentUserResponse getCurrentUserInfo(Long userId) {
        // 1. 사용자 기본 정보 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 프로필 이미지 S3 객체 키 (예: "basic/male.jpg", "uploads/1/abc.jpg")
        String profileImageKey = Optional.ofNullable(user.getProfileImage())
                .orElseThrow(() -> new GlobalException(S3ErrorCode.DEFAULT_PROFILE_IMAGE_NOT_FOUND));

        // URL 생성 또는 가져오기
        String profileImageUrl;
        /* try {
            profileImageUrl = s3Service.getOrCreateSignedUrl(user);
            // URL이 생성되었거나 갱신되었을 수 있으므로 저장
            usersRepository.save(user);
        } catch (Exception e) {
            log.error("Failed to generate profile image URL for user: {}", userId, e);
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        } */

        // ✅ Redis 캐싱 추가
        profileImageUrl = redisService.getProfileImageUrl(user.getId())
                .orElseGet(() -> {
                    try {
                        String signedUrl = s3Service.getSignedUrl(profileImageKey);
                        redisService.cacheProfileImageUrl(user.getId(), signedUrl, 3600); // 1시간 TTL
                        return signedUrl;
                    } catch (Exception e) {
                        throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
                    }
                });

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

            // 작물 정보가 없는 경우 예외 처리
            if (mentorsCrops.isEmpty()) {
                throw new GlobalException(MentorsCropsErrorCode.NO_CROPS_SELECTED);
            }

            List<String> cropNames = mentorsCrops.stream()
                    .map(mc -> {
                        // 각 작물 이름에 대한 유효성 검사
                        if (mc.getCrop() == null || mc.getCrop().getName() == null) {
                            throw new GlobalException(MentorsCropsErrorCode.INVALID_CROP_NAME);
                        }
                        return mc.getCrop().getName();
                    })
                    .collect(Collectors.toList());

            // 멘토 정보 유효성 검사
            validateMentorInfo(mentor);

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
    public UploadProfileImageResponse resetToDefaultProfileImage(Long userId) {
        // 1. 사용자 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 탈퇴한 사용자 체크
        if (user.getIsOut() == 1) {
            throw new GlobalException(UsersErrorCode.ALREADY_DELETED_USER);
        }

        // 2. 기본 이미지 키 생성
        String defaultProfileImageKey;
        try {
            defaultProfileImageKey = s3Service.getDefaultProfileImageKey(user.getGender());
            if (defaultProfileImageKey == null) {
                throw new GlobalException(S3ErrorCode.DEFAULT_PROFILE_IMAGE_NOT_FOUND);
            }
        } catch (Exception e) {
            throw new GlobalException(S3ErrorCode.S3_SERVICE_ERROR);
        }

        // 3. 이전 이미지 삭제 (기본 이미지가 아닌 경우)
        String currentProfileKey = user.getProfileImage();
        if (currentProfileKey != null && !currentProfileKey.startsWith("basic/")) {
            try {
                s3Service.deleteFile(currentProfileKey);
            } catch (AmazonS3Exception s3e) {
                throw new GlobalException(S3ErrorCode.IMAGE_DELETE_FAILED);
            } catch (Exception e) {
                throw new GlobalException(S3ErrorCode.IMAGE_DELETE_FAILED);
            }
        }

        // 4. 프로필 이미지 키 업데이트
        user.updateProfileImage(defaultProfileImageKey);

        // 5. 기존 URL 정보 초기화 (이미지가 바뀌므로)
        user.updateProfileImageUrl(null, null);

        // 6. 새 URL 생성 및 저장
        try {
            String signedUrl = s3Service.getOrCreateSignedUrl(user);
            usersRepository.save(user);

            // ✅ 기본 이미지로 초기화 시에도 캐시 갱신
            redisService.evictProfileImage(userId);
            redisService.cacheProfileImageUrl(userId, signedUrl, 3600);

            return UploadProfileImageResponse.builder()
                    .imageUrl(signedUrl)
                    .build();
        } catch (Exception e) {
            log.error("Failed to generate profile image URL for user: {}", userId, e);
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }

    /**
     * 프로필 이미지 업로드
     */
    @Transactional
    public UploadProfileImageResponse uploadUserProfileImage(Long userId, MultipartFile file) {
        // 1. 사용자 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 탈퇴한 사용자 체크
        if (user.getIsOut() == 1) {
            throw new GlobalException(UsersErrorCode.ALREADY_DELETED_USER);
        }

        // 2. 파일 유효성 검사
        if (file == null || file.isEmpty()) {
            throw new GlobalException(S3ErrorCode.FILE_NOT_PROVIDED);
        }

        // 파일 타입 체크 - jpg, jpeg, png만 허용
        String contentType = file.getContentType();
        if (contentType == null || !(
                contentType.equals("image/jpeg") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/png"))) {
            throw new GlobalException(S3ErrorCode.UNSUPPORTED_FILE_TYPE);
        }

        // 파일 크기 체크
        long maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxFileSize) {
            throw new GlobalException(S3ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 3. 이전 이미지 삭제 (기본 이미지가 아니면)
        String currentKey = user.getProfileImage();
        if (currentKey != null && !currentKey.startsWith("basic/")) {
            try {
                s3Service.deleteFile(currentKey);
            } catch (AmazonS3Exception s3e) {
                throw new GlobalException(S3ErrorCode.IMAGE_DELETE_FAILED);
            } catch (Exception e) {
                throw new GlobalException(S3ErrorCode.IMAGE_DELETE_FAILED);
            }
        }

        // 4. 새 이미지 업로드
        String newProfileImageKey;
        try {
            newProfileImageKey = s3Service.uploadResizedProfileImage(file, userId);
            if (newProfileImageKey == null) {
                throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
            }
        } catch (AmazonS3Exception s3e) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        } catch (Exception e) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }

        // 5. 사용자 프로필 이미지 키 업데이트
        user.updateProfileImage(newProfileImageKey);

        // 6. 기존 URL 정보 초기화 (이미지가 바뀌므로)
        user.updateProfileImageUrl(null, null);

        // 7. 새 URL 생성 및 저장
        try {
            String signedUrl = s3Service.getOrCreateSignedUrl(user);
            usersRepository.save(user);

            // ✅ 프로필 이미지 업로드 후 캐시 무효화 및 갱신
            redisService.evictProfileImage(userId);
            redisService.cacheProfileImageUrl(userId, signedUrl, 3600);

            return UploadProfileImageResponse.builder()
                    .imageUrl(signedUrl)
                    .build();
        } catch (Exception e) {
            log.error("Failed to generate profile image URL for user: {}", userId, e);
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }

    /**
     * 사용자 업데이트 요청 검증 메소드
     */
    private void validateUserUpdateRequest(UserUpdateRequest request) {
        // 이름 검증
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_NAME);
        }

        // 이름 길이 검증
        String trimmedName = request.getName().trim();
        if (trimmedName.length() > 20) {
            throw new GlobalException(UsersErrorCode.USER_NAME_TOO_LONG);
        }

        // 주소 검증
        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new GlobalException(UsersErrorCode.INVALID_USER_ADDRESS);
        }

        // 주소에 영어 포함 여부 검증
        String trimmedAddress = request.getAddress().trim();
        if (!trimmedAddress.matches("^[가-힣0-9\\s]+$")) {
            throw new GlobalException(UsersErrorCode.ADDRESS_CONTAINS_ENGLISH);
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

    /**
     * 비밀번호 복잡성 검증
     */
    private void validatePasswordComplexity(String password) {
        // 최소 8자 이상
        if (password.length() < 8) {
            throw new GlobalException(UsersErrorCode.PASSWORD_TOO_SHORT);
        }

        // 숫자 포함 여부
        if (!password.matches(".*\\d.*")) {
            throw new GlobalException(UsersErrorCode.PASSWORD_REQUIRES_DIGIT);
        }

        // 영문자 포함 여부
        if (!password.matches(".*[a-zA-Z].*")) {
            throw new GlobalException(UsersErrorCode.PASSWORD_REQUIRES_LETTER);
        }
    }

    // 멘토 정보 유효성 검사 메서드 추가
    private void validateMentorInfo(Mentors mentor) {
        if (StringUtils.isBlank(mentor.getBio())) {
            throw new GlobalException(MentorsErrorCode.INVALID_MENTOR_INFO);
        }

        if (mentor.getFarmingYears() == null) {
            throw new GlobalException(MentorsErrorCode.INVALID_FARMING_YEARS);
        }
    }
}