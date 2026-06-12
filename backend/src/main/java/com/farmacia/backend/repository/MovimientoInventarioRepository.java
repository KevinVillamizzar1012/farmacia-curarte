


package com.farmacia.backend.repository;

import com.farmacia.backend.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<MovimientoInventario> findByProductoId(Long productoId);
}