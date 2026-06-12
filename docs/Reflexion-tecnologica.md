# Reflexión tecnológica – Farmacias Curarte

## Tecnologías elegidas

### Frontend: Angular (versión 18, standalone components)
**¿Por qué Angular?**  
- Permite construir una **aplicación de una sola página (SPA)** con componentes reutilizables, lo que facilita el mantenimiento y la escalabilidad.  
- **TypeScript** proporciona tipado estático, reduciendo errores en tiempo de desarrollo y mejorando la autocompletación en el IDE.  
- El **sistema de enrutamiento** y los **guards** integrados simplifican la protección de rutas según el rol del usuario.  
- La **inyección de dependencias** y los **servicios** (con `BehaviorSubject`) permiten manejar el estado global (carrito, notificaciones) de forma reactiva.  
- **CLI potente** (generación de componentes, servicios, etc.) acelera el desarrollo.

### Backend: Spring Boot 3.4
**¿Por qué Spring Boot?**  
- Framework maduro y ampliamente adoptado para APIs REST.  
- **Spring Security** + **JWT** proporcionan una autenticación stateless robusta, ideal para aplicaciones modernas.  
- **Spring Data JPA** simplifica el acceso a la base de datos MySQL, reduciendo el código boilerplate.  
- La **configuración automática** y el **proyecto inicial** (start.spring.io) permiten empezar rápidamente.  
- Fácil integración con herramientas de construcción (Maven) y despliegue.

### Base de datos: MySQL
**¿Por qué MySQL?**  
- Sistema de base de datos relacional que garantiza **consistencia ACID**, crucial para operaciones de inventario y ventas.  
- **Gratuito** y con gran comunidad.  
- Soporte nativo en Spring Boot (conector JPA).  
- Permite modelar relaciones entre entidades (usuarios, productos, ventas, etc.) de forma natural.

### Seguridad: JWT (JSON Web Token)
**¿Por qué JWT en lugar de sesiones tradicionales?**  
- La API es stateless, lo que facilita la escalabilidad horizontal.  
- El token contiene la información del usuario y su rol, evitando consultas a la base de datos en cada petición (aunque en nuestra implementación se valida el token y se cargan los datos del usuario desde la BD por seguridad).  
- **Ventaja**: funciona bien con frontends separados (Angular).  
- **Desventaja**: los tokens no pueden invalidarse fácilmente antes de su expiración (se requiere un mecanismo adicional como una lista negra).

## Dificultades encontradas y soluciones

1. **CORS (Cross-Origin Resource Sharing)**  
   - *Problema*: el frontend (localhost:4200) no podía llamar a la API (localhost:8080).  
   - *Solución*: configurar un `CorsConfigurationSource` en `SecurityConfig` permitiendo el origen del frontend y los métodos necesarios.

2. **Subida de archivos (imágenes de productos, banners, avatar)**  
   - *Problema*: manejar archivos multipart y guardarlos en el servidor.  
   - *Solución*: crear endpoints con `@RequestParam("file") MultipartFile file`, guardar en una carpeta `uploads/` con nombres únicos (UUID) y servir estáticamente mediante `WebConfig`. Además, se necesitó agregar las rutas `/uploads/**` a las permitidas en `SecurityConfig`.

3. **Gestión de imágenes múltiples en productos**  
   - *Problema*: relación entre producto y varias imágenes, y mostrarlas en el frontend.  
   - *Solución*: entidad `ProductoImagen` con relación `@OneToMany`. En el frontend, usar `FormData` para enviar varias imágenes y previsualización con `FileReader`.

4. **Carrusel de banners dinámicos**  
   - *Problema*: el administrador necesitaba subir, ordenar y activar/desactivar banners sin tocar el código.  
   - *Solución*: crear entidad `Banner`, endpoints CRUD protegidos, y exponer un endpoint público `/banners/activos`. En el frontend, consumir el servicio y actualizar el carrusel.

5. **Manejo del carrito (estado global)**  
   - *Problema*: el carrito debía ser accesible desde varios componentes (home cliente, punto de venta) y persistir al recargar.  
   - *Solución*: implementar `CartService` con `BehaviorSubject` y guardar en `localStorage`. Además, añadir botones `+/-` para modificar cantidades.

6. **Roles y guards en Angular**  
   - *Problema*: restringir rutas según el rol (ADMIN, EMPLEADO, CLIENTE).  
   - *Solución*: crear un `authGuard` que lea el rol del `localStorage` y lo compare con `data.roles` de la ruta.

## Aprendizajes y buenas prácticas aplicadas

- **Componentes reutilizables**: centralizar top bar y bottom bar evitó duplicación de código y facilitó cambios globales.  
- **Uso de `BehaviorSubject`** para estado reactivo (carrito, notificaciones).  
- **Validaciones en backend y frontend**: usando Jakarta Validation y Angular reactive forms.  
- **Documentación continua**: mantener el `README.md` actualizado y los diagramas de despliegue ayuda a futuros desarrolladores.  
- **Manejo de errores**: mostrar mensajes amigables con toasts y modales.  
- **Seguridad por capas**: desde la autenticación JWT hasta el guard de Angular y las anotaciones `@PreAuthorize` en Spring.

## Conclusión

La combinación de Angular, Spring Boot, MySQL y JWT ha demostrado ser adecuada para el desarrollo de una aplicación web de gestión de farmacia. Aunque se enfrentaron varios desafíos técnicos, se resolvieron satisfactoriamente aplicando buenas prácticas y patrones de diseño. El sistema resultante es mantenible, escalable y seguro, cumpliendo con los objetivos del caso de estudio.