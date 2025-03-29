package com.backend.farmbti.property.repository;

import com.backend.farmbti.property.domain.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // 주소에서 도 정보만 포함하는 매물 검색
    @Query("SELECT p FROM Property p WHERE p.detailAddress LIKE %:doName%")
    List<Property> findByAddressContainingDo(@Param("doName") String doName);

    // 주소에서 시/군 정보만 포함하는 매물 검색
    @Query("SELECT p FROM Property p WHERE p.detailAddress LIKE %:cityName%")
    List<Property> findByAddressContainingCity(@Param("cityName") String cityName);

    // 주소에서 도와 시/군 정보 모두 포함하는 매물 검색
    @Query("SELECT p FROM Property p WHERE p.detailAddress LIKE %:doName% AND p.detailAddress LIKE %:cityName%")
    List<Property> findByAddressContainingDoAndCity(@Param("doName") String doName, @Param("cityName") String cityName);

}