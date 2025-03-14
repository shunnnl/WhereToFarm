package com.backend.farmbti.auth.repository;

import com.backend.farmbti.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
