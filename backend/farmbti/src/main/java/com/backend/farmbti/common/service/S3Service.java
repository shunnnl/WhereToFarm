package com.backend.farmbti.common.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.users.exception.UsersErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

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
            throw new GlobalException(UsersErrorCode.DEFAULT_PROFILE_IMAGE_NOT_FOUND);
        }

        return objectKey;
    }

    // 파일 업로드 메소드
    public String uploadFile(MultipartFile file, String dirName) {
        try {
            // 파일 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            // 파일명 중복 방지를 위한 UUID 사용
            String fileName = dirName + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

            // S3에 업로드
            amazonS3.putObject(
                    bucket,
                    fileName,
                    file.getInputStream(),
                    metadata
            );

            log.info("파일 업로드 성공: {}", fileName);
            return fileName; // 객체 키 반환
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new RuntimeException("파일 업로드 중 오류 발생: " + e.getMessage());
        }
    }

    // 파일 삭제 메소드
    public void deleteFile(String objectKey) {
        try {
            amazonS3.deleteObject(bucket, objectKey);
            log.info("파일 삭제 성공: {}", objectKey);
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
        }
    }
}