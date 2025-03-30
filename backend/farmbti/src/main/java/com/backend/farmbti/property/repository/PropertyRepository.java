package com.backend.farmbti.property.repository;

import com.backend.farmbti.property.domain.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // 새로 추가할 페이지네이션 메서드
    @Query(value = "SELECT p FROM Property p WHERE p.detailAddress LIKE %:doName%",
            countQuery = "SELECT COUNT(p) FROM Property p WHERE p.detailAddress LIKE %:doName%")
    Page<Property> findByAddressContainingDoWithPage(@Param("doName") String doName, Pageable pageable);

    @Query(value = "SELECT p FROM Property p WHERE p.detailAddress LIKE %:cityName%",
            countQuery = "SELECT COUNT(p) FROM Property p WHERE p.detailAddress LIKE %:cityName%")
    Page<Property> findByAddressContainingCityWithPage(@Param("cityName") String cityName, Pageable pageable);

    @Query(value = "SELECT p FROM Property p WHERE p.detailAddress LIKE %:doName% AND p.detailAddress LIKE %:cityName%",
            countQuery = "SELECT COUNT(p) FROM Property p WHERE p.detailAddress LIKE %:doName% AND p.detailAddress LIKE %:cityName%")
    Page<Property> findByAddressContainingDoAndCityWithPage(@Param("doName") String doName, @Param("cityName") String cityName, Pageable pageable);

}