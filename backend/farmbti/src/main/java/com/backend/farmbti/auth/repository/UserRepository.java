package com.backend.farmbti.auth.repository;

import com.backend.farmbti.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email); //service단에서 null 처리를 람다로 할 수 있음

    Optional<User> findUserId(Long id);
}
