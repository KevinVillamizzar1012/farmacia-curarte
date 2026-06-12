package com.farmacia.backend.service;

import com.farmacia.backend.dto.VentaRequestDTO;
import com.farmacia.backend.entity.*;
import com.farmacia.backend.repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VentaService {

    private static final Logger logger = LoggerFactory.getLogger(VentaService.class);

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimientoInventarioRepository movimientoInventarioRepository;

    @Transactional
    public Venta registrarVenta(VentaRequestDTO request) {
        // ... (sin cambios, igual que tenías)
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());
        venta.setUsuario(usuario);
        venta.setTotal(0.0);
        venta.setDetalles(new ArrayList<>());
        Venta ventaGuardada = ventaRepository.save(venta);

        double totalVenta = 0.0;

        for (VentaRequestDTO.ItemVentaDTO item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para producto: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - item.getCantidad());
            productoRepository.save(producto);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(ventaGuardada);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            double subtotal = producto.getPrecio() * item.getCantidad();
            detalle.setSubtotal(subtotal);
            detalleVentaRepository.save(detalle);

            ventaGuardada.getDetalles().add(detalle);
            totalVenta += subtotal;

            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setCantidad(-item.getCantidad());
            movimiento.setTipo("VENTA");
            movimiento.setDescripcion("Venta #" + ventaGuardada.getId() + " - " + producto.getNombre());
            movimiento.setFecha(LocalDateTime.now());
            movimiento.setUsuario(usuario);
            movimientoInventarioRepository.save(movimiento);
        }

        ventaGuardada.setTotal(totalVenta);
        return ventaRepository.save(ventaGuardada);
    }

    // Método para reportes (ya funciona)
    public List<Venta> obtenerVentasPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByFechaBetween(inicio, fin);
    }

    // Método para productos más vendidos (corregido con logs)
    public List<Map<String, Object>> obtenerProductosMasVendidos(LocalDateTime inicio, LocalDateTime fin) {
        try {
            List<Object[]> resultados = detalleVentaRepository.findProductosMasVendidosEntreFechas(inicio, fin);
            if (resultados == null || resultados.isEmpty()) {
                logger.warn("No se encontraron productos más vendidos en el período {} - {}", inicio, fin);
                return new ArrayList<>();
            }
            return resultados.stream()
                .limit(5)
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productoId", row[0]);
                    item.put("nombre", row[1] != null ? row[1] : "Producto desconocido");
                    item.put("cantidadVendida", row[2] != null ? row[2] : 0);
                    return item;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener productos más vendidos: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    // Método para últimas ventas (corregido con logs)
    public List<Venta> obtenerUltimasVentas(int limit) {
        try {
            List<Venta> ventas = ventaRepository.findTop5ByOrderByFechaDesc();
            if (ventas == null) ventas = new ArrayList<>();
            logger.info("Últimas ventas obtenidas: {}", ventas.size());
            return ventas;
        } catch (Exception e) {
            logger.error("Error al obtener últimas ventas: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }
}