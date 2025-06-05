package com.backend.farmbti.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisKey {

	private final RedisTemplate<String, Object> redisTemplate;

	public RedisTemplate<String, Object> redisTemplate() {
		return redisTemplate;
	}

	// userId 기반 로그인 토큰 Redis 키 생성
	public String getLoginTokenKey(Long userId) {
		return "LOGIN_TOKEN:" + userId;
	}
}
