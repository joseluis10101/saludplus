# SaludPlus — Contexto del Proyecto

## Propósito

Sistema para automatizar el agendamiento, confirmación, cancelación y reprogramación de citas médicas. Incluye gestión de disponibilidad de médicos, historial clínico, recetas y reportes administrativos.

## Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Pinia** para estado global y persistencia en `localStorage`
- **Tailwind CSS** para estilos — clases utilitarias directas, sin CSS adicional
- Simple, sin sobreingeniería. Sin backend real: todo el estado persiste en `localStorage` vía Pinia.

## Scope del proyecto

Solo se construyen **interfaces de usuario (UI)**. Cuando un formulario se llena y se envía, los datos se guardan en el store de Pinia correspondiente (que persiste en `localStorage`). No hay llamadas a API ni base de datos real.

## Usuarios y roles

| Rol                            | Acceso                |
| ------------------------------ | --------------------- |
| Paciente                       | Público / Autenticado |
| Médico                         | Especializado         |
| Recepcionista / Administrativo | Administrativo        |
| Administrador del sistema      | Total                 |

## Requisitos funcionales

| Código | Nombre                             | Actor          | Prioridad |
| ------ | ---------------------------------- | -------------- | --------- |
| RF01   | Registrar paciente                 | Paciente       | Alta      |
| RF02   | Reservar cita                      | Paciente       | Alta      |
| RF03   | Gestionar seguimiento de cita      | Paciente       | Alta      |
| RF04   | Registrar ingreso y pago           | Recepcionista  | Alta      |
| RF05   | Registrar atención médica          | Médico         | Alta      |
| RF06   | Consultar historial clínico        | Médico         | Alta      |
| RF07   | Acceder al panel del paciente      | Paciente       | Media     |
| RF08   | Gestionar especialidades y médicos | Administrador  | Media     |
| RF09   | Configurar agenda del médico       | Médico / Admin | Alta      |
| RF10   | Generar reportes de gestión        | Administrador  | Media     |

---

### RF01 — Registrar paciente

Formulario de registro público. Campos: nombres, apellidos, tipo y número de documento, fecha de nacimiento, sexo, correo, teléfono, dirección (opcional), contraseña.

- Validar duplicados por documento o correo (contra el store).
- Al registrar exitosamente → guardar en store de pacientes.

### RF02 — Reservar cita

El paciente autenticado busca especialidad → ve médicos disponibles → elige horario → confirma reserva.

- Los horarios disponibles provienen del store de agendas (RF09).
- Al confirmar → crear registro de cita en el store con estado `reservada`.

### RF03 — Gestionar seguimiento de cita

Desde el panel del paciente: cancelar o reprogramar una cita vigente.

- Cancelar → libera el cupo (actualiza store).
- Reprogramar → muestra horarios disponibles y reemplaza la cita.

### RF04 — Registrar ingreso y pago

El recepcionista busca la cita del día → registra llegada → verifica seguro → si no tiene cobertura, registra pago (monto, método).

- Actualiza estado de la cita a `en espera de atención`.

### RF05 — Registrar atención médica

El médico accede a la cita en curso → llena diagnóstico, tratamiento, medicamentos, indicaciones, exámenes → guarda.

- Genera receta en el store.
- Actualiza estado de cita a `atendida`.
- Consolida en historial clínico del paciente.

### RF06 — Consultar historial clínico

El médico busca paciente por documento → ve listado de atenciones previas ordenadas cronológicamente (diagnósticos, recetas, exámenes).

### RF07 — Panel del paciente

El paciente autenticado ve: citas próximas y pasadas, recetas y órdenes de laboratorio.

- Permite descargar/ver detalle de recetas.

### RF08 — Gestionar especialidades y médicos

El administrador registra, edita o desactiva especialidades y asocia médicos a cada una.

- Especialidades inactivas no aparecen en el módulo de reserva.

### RF09 — Configurar agenda del médico

El médico o administrador define bloques de horario disponibles y puede bloquear rangos.

- Los horarios bloqueados no se muestran a pacientes.

### RF10 — Generar reportes

El administrador filtra por rango de fechas, tipo (citas, cancelaciones, inasistencias) y opcionalmente por especialidad/médico.

- Mostrar tabla de resultados. Sin exportación real (solo UI).
