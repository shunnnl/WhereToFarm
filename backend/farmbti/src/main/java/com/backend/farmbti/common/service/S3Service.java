package com.backend.farmbti.common.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
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
import java.util.List;
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

    // 사용자 이미지 업로드
    public String uploadUserProfileImage(MultipartFile file, Long userId) {

        long MAX_FILE_SIZE = 5 * 1024 * 1024; // 용량 5MB 제한

        if (file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
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
            throw new GlobalException(UsersErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }
    }

    // 사용자 이미지 삭제
    public void deleteFile(String key) {
        if (amazonS3.doesObjectExist(bucket, key)) {
            amazonS3.deleteObject(bucket, key);
        }
    }

}