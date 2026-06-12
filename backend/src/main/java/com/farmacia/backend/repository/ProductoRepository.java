package com.farmacia.backend.repository;

import com.farmacia.backend.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    List<Producto> findByCategoria(String categoria);
    
    List<Producto> findByStockLessThanEqual(Integer stock);  // usa este nombre
    
    List<Producto> findByFechaVencimientoBefore(LocalDate fecha);
    
    List<Producto> findByFechaVencimientoBetween(LocalDate start, LocalDate end);

    Producto findByCodigoBarras(String codigoBarras);

    
    // Método con @Query para productos con stock bajo (stock <= stockMinimo)
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();
}