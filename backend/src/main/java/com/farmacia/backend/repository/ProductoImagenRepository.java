package com.farmacia.backend.repository;

import com.farmacia.backend.entity.ProductoImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoImagenRepository extends JpaRepository<ProductoImagen, Long> {
}