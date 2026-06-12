# Pruebas de usabilidad – System Usability Scale (SUS)

## Metodología

Se aplicó la encuesta SUS a **3 usuarios** representativos de los roles:
- Usuario 1: Cliente (sin experiencia previa en el sistema)
- Usuario 2: Empleado de mostrador
- Usuario 3: Administrador

Las tareas realizadas fueron:
- **Cliente**: registro, login, búsqueda de producto, agregar al carrito, modificar cantidades, finalizar pedido, actualizar perfil y avatar.
- **Empleado**: login, punto de venta (buscar producto, agregar al carrito, confirmar venta), consultar alertas de stock bajo e historial de inventario.
- **Administrador**: login, dashboard, gestión de usuarios (crear/editar/eliminar), gestión de productos (con imágenes), gestión de banners, reportes (exportación a Excel/PDF), registro de compra.

## Encuesta SUS (10 preguntas, escala 1 a 5)

1. Me gustaría usar este sistema con frecuencia.
2. Encontré el sistema innecesariamente complejo.
3. Me pareció fácil de usar.
4. Creo que necesitaría ayuda de un técnico para usar el sistema.
5. Las funciones del sistema están bien integradas.
6. Había mucha inconsistencia en el sistema.
7. La mayoría de la gente aprendería a usar el sistema rápidamente.
8. El sistema es muy engorroso de usar.
9. Me sentí muy seguro usando el sistema.
10. Necesitaría aprender muchas cosas antes de poder usar el sistema.

## Resultados (respuestas promedio)

| Pregunta | Cliente | Empleado | Admin | **Promedio** |
|----------|---------|----------|-------|---------------|
| 1        | 5       | 4        | 5     | 4.67 |
| 2        | 2       | 1        | 2     | 1.67 |
| 3        | 5       | 5        | 4     | 4.67 |
| 4        | 1       | 2        | 1     | 1.33 |
| 5        | 4       | 5        | 5     | 4.67 |
| 6        | 1       | 1        | 2     | 1.33 |
| 7        | 5       | 4        | 5     | 4.67 |
| 8        | 1       | 2        | 1     | 1.33 |
| 9        | 5       | 4        | 5     | 4.67 |
| 10       | 1       | 2        | 1     | 1.33 |

## Cálculo del puntaje SUS

Para cada usuario, se calcula:
- Preguntas impares (1,3,5,7,9): `(respuesta - 1) * 2.5`
- Preguntas pares (2,4,6,8,10): `(5 - respuesta) * 2.5`

Se suman los 10 puntajes y se multiplica por 2.5 (opcional, ya que cada pregunta ya da hasta 10 puntos). La fórmula estándar da un rango de 0 a 100.

**Cálculo con los promedios**:

| Pregunta | Fórmula | Puntaje |
|----------|---------|---------|
| 1 | (4.67-1)*2.5 = 9.175 |
| 2 | (5-1.67)*2.5 = 8.325 |
| 3 | (4.67-1)*2.5 = 9.175 |
| 4 | (5-1.33)*2.5 = 9.175 |
| 5 | (4.67-1)*2.5 = 9.175 |
| 6 | (5-1.33)*2.5 = 9.175 |
| 7 | (4.67-1)*2.5 = 9.175 |
| 8 | (5-1.33)*2.5 = 9.175 |
| 9 | (4.67-1)*2.5 = 9.175 |
| 10 | (5-1.33)*2.5 = 9.175 |
| **Total** | **91.75** |

## Interpretación

El puntaje SUS obtenido es **91.75 sobre 100**, lo que se considera **excelente** (muy por encima del umbral aceptable de 68). Los usuarios encontraron el sistema fácil de usar, consistente y con funciones bien integradas. Las tareas críticas (registrar venta, agregar al carrito, subir banner, etc.) se completaron sin asistencia en menos del tiempo estimado.

## Recomendaciones de mejora

- Añadir mensajes de ayuda contextuales para empleados nuevos.
- Mejorar la retroalimentación visual en la subida de imágenes (barras de progreso).
- Considerar un modo oscuro opcional.
- Implementar confirmación de eliminación de productos en el catálogo.

## Conclusión

La aplicación cumple satisfactoriamente con los requisitos de usabilidad del caso de estudio. Los usuarios manifestaron confianza y satisfacción con el sistema.