package com.backend.farmbti.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	private static final String PROFILE_IMAGE_PREFIX = "profile:image:";

	/**
	 * 프로필 이미지 URL 캐싱
	 */
	public void cacheProfileImageUrl(Long memberId, String imageUrl, long ttlInSeconds) {
		String key = PROFILE_IMAGE_PREFIX + memberId;
		redisTemplate.opsForValue().set(key, imageUrl, ttlInSeconds, TimeUnit.SECONDS);
	}

	/**
	 * 캐시된 프로필 이미지 URL 조회
	 */
	public Optional<String> getProfileImageUrl(Long memberId) {
		String key = PROFILE_IMAGE_PREFIX + memberId;
		Object value = redisTemplate.opsForValue().get(key);
		return Optional.ofNullable(value).map(Object::toString);
	}

	/**
	 * 프로필 이미지 캐시 삭제
	 */
	public void evictProfileImage(Long memberId) {
		String key = PROFILE_IMAGE_PREFIX + memberId;
		redisTemplate.delete(key);
	}
}
