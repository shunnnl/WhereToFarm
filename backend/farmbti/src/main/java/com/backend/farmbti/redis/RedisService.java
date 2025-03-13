package com.backend.farmbti.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {

	private final RedisTemplate<String, Object> redisTemplate;

	public void saveData(String key, String value) {
		redisTemplate.opsForValue().set(key, value);
	}

	public String getData(String key) {
		return (String) redisTemplate.opsForValue().get(key);
	}
}
