package com.backend.farmbti.auth.repository;

import com.backend.farmbti.auth.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    //  boolean existsByEmail(String email);

    Optional<Users> findByEmail(String email); //service단에서 null 처리를 람다로 할 수 있음

    Optional<Users> findById(Long id);

    Optional<Users> findByEmailAndIsOut(String email, byte b);
}
