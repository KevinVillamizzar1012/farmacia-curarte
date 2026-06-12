# Informe final – Proyecto Farmacias Curarte

## 1. Resumen ejecutivo

Se ha desarrollado una aplicación web completa para la gestión de inventarios, ventas y administración de la farmacia **Farmacias Curarte**. El sistema permite a tres perfiles de usuario (cliente, empleado, administrador) realizar operaciones específicas de manera intuitiva y segura. El proyecto cumple con todos los requerimientos prioritarios y secundarios establecidos en el caso de estudio, incluyendo funcionalidades como autenticación JWT, CRUD de productos con imágenes, carrito de compras, punto de venta, reportes exportables, gestión de banners dinámicos, perfil de usuario con avatar y pruebas de usabilidad.

## 2. Objetivos alcanzados

- **Optimizar la gestión de inventarios**: implementación de alertas de stock bajo, productos próximos a vencer y control de movimientos (ventas, compras, ajustes).
- **Reducir tiempos de operación**: punto de venta con búsqueda por código/nombre y actualización automática de stock.
- **Mejorar la precisión de la planificación**: reportes exportables a Excel/PDF y dashboard con métricas clave.
- **Analizar la usabilidad**: encuesta SUS arrojó puntaje de 91.75 (excelente).

## 3. Tecnologías implementadas

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | Angular (standalone) | 18 |
| Backend | Spring Boot | 3.4 |
| Base de datos | MySQL | 8.0 |
| Autenticación | JWT | - |
| Control de versiones | Git + GitHub | - |

## 4. Funcionalidades principales

- **Autenticación y roles**: registro, login, tokens JWT, guards en Angular, anotaciones `@PreAuthorize`.
- **Productos**: CRUD completo con subida múltiple de imágenes, previsualización, búsqueda y filtrado.
- **Ventas**: registro de venta con actualización de stock, historial de movimientos.
- **Usuarios**: CRUD solo para administradores.
- **Banners**: gestión dinámica del carrusel (subir, ordenar, activar/desactivar).
- **Reportes**: exportación de ventas por período, stock bajo, próximos a vencer.
- **Perfil**: edición de datos personales, cambio de contraseña, avatar.
- **Carrito**: persistencia, botones +/- , modal de confirmación.

## 5. Dificultades y soluciones destacadas

| Dificultad | Solución |
|------------|----------|
| CORS | Configuración centralizada en `SecurityConfig`. |
| Subida de múltiples imágenes | Entidad `ProductoImagen`, almacenamiento en `uploads/` con nombre único. |
| Estado del carrito | `BehaviorSubject` + `localStorage`. |
| Roles en rutas de Angular | `authGuard` con verificación de `data.roles`. |
| Banners dinámicos | Entidad `Banner`, endpoint público `/activos`, formulario de gestión. |

## 6. Pruebas y resultados

- **Pruebas funcionales**: todos los endpoints probados con Postman (colección incluida).
- **Pruebas de usabilidad (SUS)**: puntaje 91.75, categoría "excelente".
- **Pruebas de rendimiento**: tiempos de carga < 2 segundos en entorno local.

## 7. Trabajo futuro (recomendaciones)

- Integrar pasarela de pagos real (Stripe).
- Notificaciones por correo electrónico y WhatsApp.
- Facturación electrónica.
- Mejorar seguridad: rate limiting en login, cookies HttpOnly para JWT.
- Desplegar en la nube con HTTPS y dominio propio.

## 8. Conclusiones

El proyecto **Farmacias Curarte** demuestra que es factible modernizar los procesos de una farmacia mediante una aplicación web bien diseñada. Se han cubierto todos los requisitos del caso de estudio, se ha obtenido una alta valoración de usabilidad y se ha sentado una base sólida para futuras mejoras. El código fuente, la documentación y los recursos están disponibles en el repositorio de GitHub para su revisión y uso.

**Entregables**:
- Código fuente (backend y frontend).
- Script SQL con datos de prueba.
- Colección de Postman.
- Manual de usuario.
- Diagrama de despliegue y componentes.
- Reflexión tecnológica.
- Resultados de pruebas SUS.
- Informe final.

**Contacto**: [Tu nombre] – [enlace a GitHub/LinkedIn]