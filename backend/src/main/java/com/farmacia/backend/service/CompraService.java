package com.farmacia.backend.service;

import com.farmacia.backend.dto.CompraRequestDTO;
import com.farmacia.backend.entity.*;
import com.farmacia.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.farmacia.backend.entity.MovimientoInventario;
import com.farmacia.backend.repository.MovimientoInventarioRepository;







@Service
public class CompraService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private MovimientoInventarioRepository movimientoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public void registrarCompra(CompraRequestDTO request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        for (CompraRequestDTO.ItemCompraDTO item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Aumentar stock
            producto.setStock(producto.getStock() + item.getCantidad());
            productoRepository.save(producto);

            // Registrar movimiento de entrada
            MovimientoInventario movimiento = new MovimientoInventario();
            movimiento.setProducto(producto);
            movimiento.setCantidad(item.getCantidad());
            movimiento.setTipo("ENTRADA");
            movimiento.setDescripcion("Compra a proveedor: " + (request.getProveedor() != null ? request.getProveedor() : "N/A"));
            movimiento.setUsuario(usuario);
            movimientoRepository.save(movimiento);
        }
    }
}