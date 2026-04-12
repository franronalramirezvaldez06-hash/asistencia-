package com.example.backend.repository;

import com.example.backend.model.EstadoAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstadoRepository extends JpaRepository<EstadoAsistencia, Long> {
}
