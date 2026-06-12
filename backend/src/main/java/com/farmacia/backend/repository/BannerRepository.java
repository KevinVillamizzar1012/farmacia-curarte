package com.farmacia.backend.repository;

import com.farmacia.backend.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActivoTrueOrderByOrdenAsc();
}