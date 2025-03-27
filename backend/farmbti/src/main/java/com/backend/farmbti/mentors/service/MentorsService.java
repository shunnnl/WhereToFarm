package com.backend.farmbti.mentors.service;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.auth.exception.AuthErrorCode;
import com.backend.farmbti.auth.repository.UsersRepository;
import com.backend.farmbti.common.exception.GlobalException;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    /**
     * 멘토 등록
     */
    @Transactional
    public void registerMentor(MentorRegisterRequest request, Long userId) {
        // 1. 이미 멘토로 등록되어 있는지 확인
        if (mentorsRepository.existsByUserId(userId)) {
            throw new GlobalException(MentorsErrorCode.ALREADY_REGISTERED_AS_MENTOR);
        }

        // 2. 사용자 정보 조회
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new GlobalException(AuthErrorCode.USER_NOT_FOUND));

        // 3. 입력값 검증
        validateMentorRequest(request);

        // 4. 작물 이름 유효성 검증
        List<Crops> crops = validateCropNames(request.getCropNames());

        // 5. 멘토 객체 생성 및 저장
        Mentors mentor = Mentors.builder()
                .user(user)
                .bio(request.getBio())
                .farmingYears(request.getFarmingYears())
                .build();

        Mentors savedMentor = mentorsRepository.save(mentor);

        // 6. 멘토-작물 관계 설정
        List<MentorsCrops> mentorCrops = crops.stream()
                .map(crop -> MentorsCrops.builder()
                        .mentor(savedMentor)
                        .crop(crop)
                        .build())
                .collect(Collectors.toList());

        mentorsCropsRepository.saveAll(mentorCrops);
    }

    /**
     * 멘토 정보 수정
     */
    @Transactional
    public void updateMentorInfo(MentorRegisterRequest request, Long userId) {
        // 1. 멘토 정보 조회
        Mentors mentor = mentorsRepository.findByUserId(userId)
                .orElseThrow(() -> new GlobalException(MentorsErrorCode.MENTOR_NOT_FOUND));

        // 2. 입력값 검증 (기존 validateMentorRequest 메소드 재사용)
        validateMentorRequest(request);

        // 3. 작물 이름 유효성 검증 (기존 validateCropNames 메소드 재사용)
        List<Crops> newCrops = validateCropNames(request.getCropNames());

        // 4. 멘토 정보 업데이트
        mentor.updateMentorInfo(request.getBio(), request.getFarmingYears());

        // 5. 기존 멘토-작물 관계 삭제
        mentorsCropsRepository.deleteByMentorId(mentor.getId());

        // 6. 새로운 멘토-작물 관계 설정
        List<MentorsCrops> mentorCrops = newCrops.stream()
                .map(crop -> MentorsCrops.builder()
                        .mentor(mentor)
                        .crop(crop)
                        .build())
                .collect(Collectors.toList());

        mentorsCropsRepository.saveAll(mentorCrops);
    }

    /**
     * 지역별 멘토 조회
     */
    @Transactional(readOnly = true)
    public List<MentorListResponse> getMentorsByLocation(String city) {
        List<Mentors> mentors = mentorsRepository.findByUser_AddressContaining(city);

        return mentors.stream()
                .map(mentor -> {
                    Users user = mentor.getUser();

                    // 멘토가 키우는 작물 조회
                    List<MentorsCrops> mentorsCrops = mentorsCropsRepository.findByMentorId(mentor.getId());
                    List<String> cropNames = mentorsCrops.stream()
                            .map(mc -> mc.getCrop().getName())
                            .collect(Collectors.toList());

                    // 응답 객체 생성 (유저 정보 + 멘토 정보)
                    return MentorListResponse.builder()
                            // 유저 정보
                            .userId(user.getId())
                            .email(user.getEmail())
                            .name(user.getName())
                            .address(user.getAddress())
                            .birth(user.getBirth())
                            .gender(user.getGender())
                            .profileImage(user.getProfileImage())

                            // 멘토 정보
                            .mentorId(mentor.getId())
                            .bio(mentor.getBio())
                            .farmingYears(mentor.getFarmingYears())
                            .cropNames(cropNames)
                            .build();
                })
                .collect(Collectors.toList());
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
        List<Crops> crops = new ArrayList<>();

        for (String name : cropNames) {
            try {
                Optional<Crops> cropOptional = cropsRepository.findByName(name);
                if (cropOptional.isPresent()) {
                    crops.add(cropOptional.get());
                } else {
                    // 해당 이름의 작물이 없는 경우
                    throw new GlobalException(MentorsCropsErrorCode.INVALID_CROP_NAME);
                }
            } catch (Exception e) {
                // DB 조회 중 다른 예외가 발생한 경우
                throw new GlobalException(MentorsCropsErrorCode.INVALID_CROP_NAME);
            }
        }

        return crops;
    }
}