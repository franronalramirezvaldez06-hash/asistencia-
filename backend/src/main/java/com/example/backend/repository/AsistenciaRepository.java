package com.example.backend.repository;

import com.example.backend.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate; // Asegúrate de importar esto
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByAlumnoGrupoIdAndFecha(Long grupoId, LocalDate fecha);
}