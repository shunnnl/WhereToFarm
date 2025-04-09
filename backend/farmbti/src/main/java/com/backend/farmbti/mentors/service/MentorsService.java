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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
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
     * 도/시 정보를 사용한 지역별 멘토 조회
     */
    @Transactional
    public List<MentorListResponse> getMentorsByLocation(String doName, String cityName) {
        try {
            log.debug("지역별 멘토 조회: doName={}, cityName={}", doName, cityName);

            List<Mentors> mentors;

            // 특별/광역시 및 도 약칭 처리
            String searchDoName = doName;
            // 특별/광역시 약칭
            if (doName.equals("서울특별시")) {
                searchDoName = "서울";
            } else if (doName.equals("부산광역시")) {
                searchDoName = "부산";
            } else if (doName.equals("인천광역시")) {
                searchDoName = "인천";
            } else if (doName.equals("대구광역시")) {
                searchDoName = "대구";
            } else if (doName.equals("광주광역시")) {
                searchDoName = "광주";
            } else if (doName.equals("대전광역시")) {
                searchDoName = "대전";
            } else if (doName.equals("울산광역시")) {
                searchDoName = "울산";
            }
            // 도 매핑
            else if (doName.equals("경기도")) {
                searchDoName = "경기";
            } else if (doName.equals("강원도")) {
                searchDoName = "강원특별자치도";
            } else if (doName.equals("충청북도")) {
                searchDoName = "충북";
            } else if (doName.equals("충청남도")) {
                searchDoName = "충남";
            } else if (doName.equals("전라북도")) {
                searchDoName = "전북특별자치도";
            } else if (doName.equals("전라남도")) {
                searchDoName = "전남";
            } else if (doName.equals("경상북도")) {
                searchDoName = "경북";
            } else if (doName.equals("경상남도")) {
                searchDoName = "경남";
            } else if (doName.equals("제주도")) {
                searchDoName = "제주특별자치도";
            }

            // 세종특별자치시는 예외 처리
            if (doName.equals("세종특별자치시") || doName.equals("세종시")) {
                // 원래 형태인 "세종특별자치시"로 검색
                mentors = mentorsRepository.findByUser_AddressContaining("세종특별자치시");
            } else {
                // 도와 시/군/구 조합으로 검색
                String searchTerm = searchDoName;
                if (cityName != null && !cityName.isEmpty()) {
                    searchTerm += " " + cityName;
                }
                mentors = mentorsRepository.findByUser_AddressContaining(searchTerm);
            }

            // 탈퇴하지 않은 사용자의 멘토만 필터링 및 mentor_id 기준 내림차순 정렬
            List<Mentors> activeMentors = mentors.stream()
                .filter(mentor -> mentor.getUser().getIsOut() == (byte) 0)
                .sorted(Comparator.comparing(Mentors::getId, Comparator.reverseOrder())) // 내림차순 정렬 추가
                .collect(Collectors.toList());

            if (activeMentors.isEmpty()) {
                throw new GlobalException(MentorsErrorCode.NO_MENTORS_IN_LOCATION);
            }

            return activeMentors.stream()
                    .map(this::convertToMentorListResponse)
                    .collect(Collectors.toList());
        } catch (GlobalException e) {
            throw e;
        } catch (Exception e) {
            log.error("지역별 멘토 조회 실패: doName={}, cityName={}, error={}", doName, cityName, e.getMessage(), e);
            throw new GlobalException(MentorsErrorCode.MENTOR_LOCATION_SEARCH_FAILED);
        }
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
            // 1. 이미 생성된 URL이 있고 만료되지 않았으면 그대로 반환
            if (user.getProfileImageUrl() != null && !user.isProfileImageUrlExpired()) {
                log.debug("Using existing URL for user: {}", user.getId());
                return user.getProfileImageUrl();
            }

            // 2. URL이 없거나 만료된 경우 새로 생성
            String profileImageUrl = s3Service.getOrCreateSignedUrl(user);

            // 3. 생성된 URL 저장
            usersRepository.save(user);

            return profileImageUrl;
        } catch (Exception e) {
            log.error("Failed to generate profile image URL for user: {}", user.getId(), e);
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_URL_GENERATION_FAILED);
        }
    }

}