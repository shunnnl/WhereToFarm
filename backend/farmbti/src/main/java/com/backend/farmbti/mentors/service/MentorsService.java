package com.backend.farmbti.mentors.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.service.S3Service;
import com.backend.farmbti.crops.domain.Crops;
import com.backend.farmbti.crops.repository.CropsRepository;
import com.backend.farmbti.mentors.domain.Mentors;
import com.backend.farmbti.mentors.domain.MentorsCrops;
import com.backend.farmbti.mentors.dto.MentorListResponse;
import com.backend.farmbti.mentors.dto.MentorRegisterRequest;
import com.backend.farmbti.mentors.exception.MentorsCropsErrorCode;
import com.backend.farmbti.mentors.exception.MentorsErrorCode;
import com.backend.farmbti.mentors.repository.MentorsCropsRepository;
import com.backend.farmbti.mentors.repository.MentorsRepository;
import com.backend.farmbti.users.dto.CurrentUserResponse;
import com.backend.farmbti.users.exception.UsersErrorCode;
import com.backend.farmbti.users.service.UsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MentorsService {

    private final MentorsRepository mentorsRepository;
    private final UsersRepository usersRepository;
    private final CropsRepository cropsRepository;
    private final MentorsCropsRepository mentorsCropsRepository;
    private final UsersService usersService;
    private final S3Service s3Service;

    /**
     * 멘토 등록
     */
    @Transactional
    public void registerMentor(MentorRegisterRequest request, Long userId) {
        validateMentorRegistration(userId);
        validateMentorRequest(request);
        try {

            // 1. 사용자 정보 조회
            Users user = findUserById(userId);

            // 2. 작물 이름 유효성 검증
            List<Crops> crops = validateCropNames(request.getCropNames());

            // 3. 멘토 객체 생성 및 저장
            Mentors savedMentor = createAndSaveMentor(user, request);

            // 4. 멘토-작물 관계 설정
            createMentorCropRelations(savedMentor, crops);

        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(MentorsErrorCode.MENTOR_REGISTRATION_FAILED);
        }
    }

    private void validateMentorRegistration(Long userId) {
        if (mentorsRepository.existsByUserId(userId)) {
            throw new GlobalException(MentorsErrorCode.ALREADY_REGISTERED_AS_MENTOR);
        }
    }

    private Users findUserById(Long userId) {
        return usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));
    }

    private Mentors createAndSaveMentor(Users user, MentorRegisterRequest request) {
        Mentors mentor = Mentors.builder()
                .user(user)
                .bio(request.getBio())
                .farmingYears(request.getFarmingYears())
                .build();

        return mentorsRepository.save(mentor);
    }

    private void createMentorCropRelations(Mentors mentor, List<Crops> crops) {
        try {
            List<MentorsCrops> mentorCrops = crops.stream()
                    .map(crop -> MentorsCrops.builder()
                            .mentor(mentor)
                            .crop(crop)
                            .build())
                    .collect(Collectors.toList());

            mentorsCropsRepository.saveAll(mentorCrops);
        } catch (Exception e) {
            throw new GlobalException(MentorsErrorCode.MENTOR_CROP_RELATION_FAILED);
        }
    }


    /**
     * 멘토 정보 수정
     */
    @Transactional
    public CurrentUserResponse updateMentorInfo(MentorRegisterRequest request, Long userId) {
        try {
            // 1. 멘토 정보 조회
            Mentors mentor = findMentorByUserId(userId);

            // 2. 입력값 검증
            validateMentorRequest(request);

            // 3. 작물 이름 유효성 검증
            List<Crops> newCrops = validateCropNames(request.getCropNames());

            // 4. 멘토 정보 업데이트
            updateMentorDetails(mentor, request);

            // 5. 기존 멘토-작물 관계 삭제 및 새 관계 설정
            updateMentorCropRelations(mentor, newCrops);

            return usersService.getCurrentUserInfo(userId);

        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(MentorsErrorCode.MENTOR_UPDATE_FAILED);
        }
    }

    private Mentors findMentorByUserId(Long userId) {
        return mentorsRepository.findByUserId(userId)
                .orElseThrow(() -> new GlobalException(MentorsErrorCode.MENTOR_NOT_FOUND));
    }

    private void updateMentorDetails(Mentors mentor, MentorRegisterRequest request) {
        mentor.updateMentorInfo(request.getBio(), request.getFarmingYears());
    }

    private void updateMentorCropRelations(Mentors mentor, List<Crops> newCrops) {
        try {
            mentorsCropsRepository.deleteByMentorId(mentor.getId());

            List<MentorsCrops> mentorCrops = newCrops.stream()
                    .map(crop -> MentorsCrops.builder()
                            .mentor(mentor)
                            .crop(crop)
                            .build())
                    .collect(Collectors.toList());

            mentorsCropsRepository.saveAll(mentorCrops);
        } catch (Exception e) {
            throw new GlobalException(MentorsErrorCode.MENTOR_CROP_RELATION_FAILED);
        }
    }

    /**
     * 지역별 멘토 조회
     */
    @Transactional(readOnly = true)
    public List<MentorListResponse> getMentorsByLocation(String city) {
        try {
            validateLocationInput(city);
            List<Mentors> mentors = findMentorsByCity(city);
            return mentors.stream()
                    .map(this::convertToMentorListResponse)
                    .collect(Collectors.toList());
        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            throw new GlobalException(MentorsErrorCode.MENTOR_LOCATION_SEARCH_FAILED);
        }
    }

    private void validateLocationInput(String city) {
        if (StringUtils.isBlank(city)) {
            throw new GlobalException(MentorsErrorCode.INVALID_LOCATION_PARAMETER);
        }
    }

    private List<Mentors> findMentorsByCity(String city) {
        List<Mentors> allMentors = mentorsRepository.findByUser_AddressContaining(city);

        // 탈퇴하지 않은 사용자(isOut = 0)의 멘토만 필터링
        List<Mentors> activeMentors = allMentors.stream()
                .filter(mentor -> mentor.getUser().getIsOut() == (byte) 0)
                .collect(Collectors.toList());

        if (activeMentors.isEmpty()) {
            throw new GlobalException(MentorsErrorCode.NO_MENTORS_IN_LOCATION);
        }

        return activeMentors;
    }

    private MentorListResponse convertToMentorListResponse(Mentors mentor) {
        Users user = mentor.getUser();

        List<String> cropNames = mentorsCropsRepository.findByMentorId(mentor.getId()).stream()
                .map(mc -> mc.getCrop().getName())
                .collect(Collectors.toList());

        return MentorListResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .address(user.getAddress())
                .birth(user.getBirth())
                .gender(user.getGender())
                .profileImage(getProfileImageUrl(user))
                .mentorId(mentor.getId())
                .bio(mentor.getBio())
                .farmingYears(mentor.getFarmingYears())
                .cropNames(cropNames)
                .build();
    }

    /**
     * 멘토 등록 요청 검증
     */
    private void validateMentorRequest(MentorRegisterRequest request) {
        // 자기소개 검증
        if (request.getBio() == null || request.getBio().trim().isEmpty()) {
            throw new GlobalException(MentorsErrorCode.INVALID_MENTOR_INFO);
        }

        // 영농 경력 연수 검증
        if (request.getFarmingYears() == null) {
            throw new GlobalException(MentorsErrorCode.INVALID_FARMING_YEARS);
        }

        // 작물 선택 검증
        if (request.getCropNames() == null || request.getCropNames().isEmpty()) {
            throw new GlobalException(MentorsCropsErrorCode.NO_CROPS_SELECTED);
        }

    }

    /**
     * 작물 이름 유효성 검증
     */
    private List<Crops> validateCropNames(List<String> cropNames) {
        if (cropNames == null || cropNames.isEmpty()) {
            throw new GlobalException(MentorsCropsErrorCode.NO_CROPS_SELECTED);
        }

        return cropNames.stream()
                .map(this::findValidCrop)
                .collect(Collectors.toList());
    }

    private Crops findValidCrop(String cropName) {
        return cropsRepository.findByName(cropName)
                .orElseThrow(() -> new GlobalException(
                        MentorsCropsErrorCode.INVALID_CROP_NAME));
    }

    private String getProfileImageUrl(Users user) {
        try {
            String profileImageKey = Optional.ofNullable(user.getProfileImage())
                    .orElse(s3Service.getDefaultProfileImageKey(user.getGender()));

            return s3Service.getSignedUrl(profileImageKey);
        } catch (Exception e) {
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }

}