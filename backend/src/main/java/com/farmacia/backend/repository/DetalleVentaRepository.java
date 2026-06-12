package com.farmacia.backend.repository;

import com.farmacia.backend.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    @Query("SELECT d.producto.id, d.producto.nombre, SUM(d.cantidad) as totalVendido " +
           "FROM DetalleVenta d GROUP BY d.producto.id ORDER BY totalVendido DESC")
    List<Object[]> findProductosMasVendidos();

    @Query("SELECT d.producto.id, d.producto.nombre, SUM(d.cantidad) as totalVendido " +
           "FROM DetalleVenta d WHERE d.venta.fecha BETWEEN :inicio AND :fin " +
           "GROUP BY d.producto.id ORDER BY totalVendido DESC")
    List<Object[]> findProductosMasVendidosEntreFechas(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}