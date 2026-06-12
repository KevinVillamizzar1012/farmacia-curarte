package com.farmacia.backend.service;

import com.farmacia.backend.dto.CompraRequestDTO;
import com.farmacia.backend.dto.MovimientoInventarioDTO;
import com.farmacia.backend.entity.MovimientoInventario;
import com.farmacia.backend.entity.Producto;
import com.farmacia.backend.entity.Usuario;
import com.farmacia.backend.repository.MovimientoInventarioRepository;
import com.farmacia.backend.repository.ProductoRepository;
import com.farmacia.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MovimientoInventarioService {

    @Autowired
    private MovimientoInventarioRepository repository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<MovimientoInventarioDTO> obtenerMovimientos(LocalDateTime inicio, LocalDateTime fin) {
        List<MovimientoInventario> movimientos;
        if (inicio != null && fin != null) {
            movimientos = repository.findByFechaBetween(inicio, fin);
        } else {
            movimientos = repository.findAll();
        }

        List<MovimientoInventarioDTO> dtos = new ArrayList<>();
        for (MovimientoInventario m : movimientos) {
            String productoNombre = (m.getProducto() != null) ? m.getProducto().getNombre() : "Producto eliminado";
            String usuarioNombre = (m.getUsuario() != null) ? m.getUsuario().getUsername() : "Usuario desconocido";
            dtos.add(new MovimientoInventarioDTO(
                m.getId(),
                productoNombre,
                m.getCantidad(),
                m.getTipo(),
                m.getDescripcion(),
                m.getFecha(),
                usuarioNombre,
                m.getProveedor(),
                m.getObservaciones()
            ));
        }
        return dtos;
    }

    @Transactional
    public List<MovimientoInventario> registrarCompra(CompraRequestDTO request) {
        // Obtener usuario autenticado
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<MovimientoInventario> movimientos = new ArrayList<>();
        for (CompraRequestDTO.ItemCompraDTO item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            // Actualizar stock (sumar cantidad)
            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);

            // Crear movimiento de inventario
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setCantidad(item.getCantidad()); // positivo porque es compra
            movimiento.setTipo("COMPRA");
            movimiento.setDescripcion("Compra de " + item.getCantidad() + " unidades");
            movimiento.setFecha(LocalDateTime.now());
            movimiento.setUsuario(usuario);
            movimiento.setProveedor(request.getProveedor());
            movimiento.setObservaciones(request.getObservaciones());
            movimientos.add(repository.save(movimiento));
        }
        return movimientos;
    }

    public List<MovimientoInventario> obtenerMovimientosRaw() {
        return repository.findAll();
    }
}