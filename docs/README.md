# 💊 Farmacias Curarte – Sistema de Gestión de Farmacia

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-green?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

> Aplicación web completa para la gestión de inventarios, ventas y administración de una farmacia, con tres roles diferenciados: **Cliente**, **Empleado** y **Administrador**.

## 📋 Tabla de contenidos
- [Descripción general](#descripción-general)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
  - [Backend (Spring Boot)](#backend-spring-boot)
  - [Frontend (Angular)](#frontend-angular)
  - [Base de datos MySQL](#base-de-datos-mysql)
- [Ejecución del proyecto](#ejecución-del-proyecto)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Documentación adicional](#documentación-adicional)
- [Mejoras futuras](#mejoras-futuras)
- [Autor y contacto](#autor-y-contacto)

---

## 📖 Descripción general

**Farmacias Curarte** nace de la necesidad de una droguería familiar de modernizar sus procesos manuales (hojas de cálculo, cuadernos) que generaban pérdidas por vencimientos, desabastecimiento y errores humanos.

El sistema permite:
- **Clientes**: navegar por el catálogo, buscar productos, agregar al carrito (con botones +/‑), gestionar su perfil con avatar, y realizar pedidos (simulación sin pasarela real).
- **Empleados**: punto de venta (POS) con búsqueda por código/nombre, carrito, confirmación de ventas, consulta de stock bajo, productos próximos a vencer e historial de inventario.
- **Administradores**: dashboard con métricas y gráficos, CRUD de usuarios, productos (con imágenes múltiples), banners del carrusel, reportes exportables (Excel/PDF), gestión de compras y trazabilidad de movimientos.

La aplicación se ha desarrollado siguiendo buenas prácticas de seguridad (JWT, roles, guards) y una arquitectura limpia de componentes reutilizables.

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Frontend** | Angular 18 (standalone components) | Interfaz de usuario SPA, componentes reutilizables, consumo de API REST |
| | TypeScript | Tipado estático, mantenibilidad |
| | Bootstrap Icons + CSS custom | Estilos coherentes con paleta corporativa (#07666D, #0FB7CF) |
| | Chart.js | Gráfico de ventas en el dashboard |
| | XLSX / jsPDF | Exportación de reportes |
| **Backend** | Spring Boot 3.4 | API REST, lógica de negocio, seguridad |
| | Spring Security + JWT | Autenticación stateless, roles (ADMIN, EMPLEADO, CLIENTE) |
| | Spring Data JPA | Persistencia y consultas a MySQL |
| | Maven | Gestión de dependencias |
| **Base de datos** | MySQL 8.0 | Almacenamiento relacional (usuarios, productos, ventas, banners, etc.) |
| **Otros** | Git & GitHub | Control de versiones y portafolio |
| | Postman | Colección de pruebas de API |

---

## 📦 Requisitos previos

Antes de instalar, asegúrate de tener:

- Java 21 o superior
- Node.js 20+ y npm
- MySQL 8.0
- Git (opcional, para clonar el repositorio)

---

## 🧩 Instalación y configuración

### Backend (Spring Boot)

1. Clona el repositorio y accede a la carpeta del backend:
   ```bash
   git clone https://github.com/tuusuario/farmacia-curarte.git
   cd farmacia-curarte/backend