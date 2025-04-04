package com.backend.farmbti.common.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.backend.farmbti.common.exception.GlobalException;
import com.backend.farmbti.common.exception.S3ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private static final int MAX_WIDTH = 400; // 이미지 리사이징 최대 크기 (평균 : 800)
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

    // 이미지 리사이징 메소드
    private InputStream resizeImage(MultipartFile file) throws IOException {

        // 원본 이미지 읽기
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        int originWidth = originalImage.getWidth();
        int originHeight = originalImage.getHeight();

        // 원본 이미지가 MAX_WIDTH보다 작으면 리사이징 하지 않음
        if (originWidth <= MAX_WIDTH) {
            return file.getInputStream();
        }

        // 비율 계산
        double ratio = (double) MAX_WIDTH / originWidth;
        int targetHeight = (int) (originHeight * ratio);

        // 새 이미지 생성 (RGB 모드 사용)
        BufferedImage resizedImage = new BufferedImage(MAX_WIDTH, targetHeight, BufferedImage.TYPE_INT_RGB);

        // 고품질 렌더링 설정
        Graphics2D g2d = resizedImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // 흰색 배경으로 채우기 (선명한 이미지를 위해)
        g2d.fillRect(0, 0, MAX_WIDTH, targetHeight);

        // 이미지 그리기
        g2d.drawImage(originalImage, 0, 0, MAX_WIDTH, targetHeight, null);
        g2d.dispose();

        // 바이트 배열로 변환 (JPEG 형식으로)
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpeg", outputStream);

        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    // 리사이징된 사용자 이미지 업로드
    public String uploadResizedProfileImage(MultipartFile file, Long userId) {
        long MAX_FILE_SIZE = 5 * 1024 * 1024; // 용량 5MB 제한

        if (file.isEmpty() || file.getSize() > MAX_FILE_SIZE) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }

        // 이미지 타입인지 확인
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new GlobalException(S3ErrorCode.PROFILE_IMAGE_UPLOAD_FAILED);
        }

        try {
            String uuid = UUID.randomUUID().toString();

            // 파일 타입에 따라 확장자 결정
            String extension = ".jpg"; // 기본값
            String finalContentType = "image/jpeg"; // 기본 콘텐츠 타입

            if (contentType.contains("png")) {
                extension = ".png";
                finalContentType = "image/png";
            } else if (contentType.contains("jpeg") || contentType.contains("jpg")) {
                extension = ".jpg";
                finalContentType = "image/jpeg";
            }

            String key = "uploads/" + userId + "/profile_" + uuid + extension;

            InputStream inputStream = resizeImage(file);

            byte[] imageBytes = inputStream.readAllBytes();

            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(imageBytes.length);
            metadata.setContentType(finalContentType); // 파일 타입에 맞는 콘텐츠 타입 설정

            // S3에 업로드
            amazonS3.putObject(bucket, key, new ByteArrayInputStream(imageBytes), metadata);

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
}