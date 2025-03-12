package com.backend.farmbti.redis;

import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redis")
public class RedisController {
	private final StringRedisTemplate redisTemplate;

	public RedisController(StringRedisTemplate redisTemplate) {
		this.redisTemplate = redisTemplate;
	}

	@GetMapping("/ping")
	public ResponseEntity<String> pingRedis() {
		try {
			String pong = redisTemplate.execute((RedisConnection connection) -> connection.ping());
			return ResponseEntity.ok("Redis 연결 성공: " + pong);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Redis 연결 실패: " + e.getMessage());
		}
	}
}


