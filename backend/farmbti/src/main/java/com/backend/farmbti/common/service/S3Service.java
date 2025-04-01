package com.backend.farmbti.common.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.exception.S3ErrorCode;
import com.backend.farmbti.users.exception.UsersErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // 서명된 URL 생성하기
    public String getSignedUrl(String objectKey) {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60 * 24 * 7; // 7일 유효
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    // 기본 프로필 이미지 객체 키 가져오기
    public String getDefaultProfileImageKey(Byte gender) {
        String objectKey = "basic/" + (gender == 1 ? "basic_1.jpg" : "basic_0.jpg");

        if (!amazonS3.doesObjectExist(bucket, objectKey)) {
            throw new GlobalException(S3ErrorCode.DEFAULT_PROFILE_IMAGE_NOT_FOUND);
        }

        return objectKey;
    }

    // 사용자 이미지 업로드
    public String uploadUserProfileImage(MultipartFile file, Long userId) {

        long MAX_FILE_SIZE = 5 * 1024 * 1024; // 용량 5MB 제한

        if (file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }

        try {
            String uuid = UUID.randomUUID().toString();
            String key = "uploads/" + userId + "/profile_" + uuid + ".jpg";

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(bucket, key, file.getInputStream(), metadata);
            return key;
        } catch (IOException e) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }
    }

    // 사용자 이미지 삭제
    public void deleteFile(String key) {
        if (amazonS3.doesObjectExist(bucket, key)) {
            amazonS3.deleteObject(bucket, key);
        }
    }

    /**
     * news 폴더의 여러 이미지에 대한 서명된 URL 목록을 반환하는 메서드
     *
     * @return 각 이미지의 키와 해당 서명된 URL을 포함하는 Map
     */
    public Map<String, String> getNewsImagesSignedUrls() {
        Map<String, String> signedUrls = new HashMap<>();

        List<String> imageKeys = List.of(
                "news/news1.jpg",
                "news/news2.jpg",
                "news/news3.jpg"
        );

        for (String objectKey : imageKeys) {
            try {
                // 객체가 존재하는지 확인
                if (!amazonS3.doesObjectExist(bucket, objectKey)) {
                    log.warn("Image not found in S3: {}", objectKey);
                    continue; // 존재하지 않는 이미지는 건너뜀
                }

                // 기존 getSignedUrl 메서드를 활용하여 서명된 URL 생성
                String signedUrl = getSignedUrl(objectKey);

                // 파일명만 추출하여 키로 사용
                String fileName = objectKey.substring(objectKey.lastIndexOf('/') + 1);
                signedUrls.put(fileName, signedUrl);

            } catch (AmazonS3Exception e) {
                log.error("Error generating signed URL for {}: {}", objectKey, e.getMessage());
            }
        }

        return signedUrls;
    }

}