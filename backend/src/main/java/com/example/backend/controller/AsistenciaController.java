package com.example.backend.controller;

import com.example.backend.model.Asistencia;
import com.example.backend.repository.AsistenciaRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final AsistenciaRepository repo;

    public AsistenciaController(AsistenciaRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/buscar")
    public List<Asistencia> buscar(
            @RequestParam Long grupoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        System.out.println("Petición recibida - Grupo ID: " + grupoId + " | Fecha: " + fecha);

        return repo.findByAlumnoGrupoIdAndFecha(grupoId, fecha);
    }

    @GetMapping
    public List<Asistencia> listar() {
        return repo.findAll();
    }

    @PostMapping
    public List<Asistencia> guardar(@RequestBody List<Asistencia> asistencias) {
        return repo.saveAll(asistencias);
    }
}