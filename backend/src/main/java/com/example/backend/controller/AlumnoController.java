package com.example.backend.controller;

import com.example.backend.model.Alumno;
import com.example.backend.repository.AlumnoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alumnos")
@CrossOrigin
public class AlumnoController {
    private final AlumnoRepository repo;

    public AlumnoController(AlumnoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Alumno> listar() {
        return repo.findAll();
    }

    @GetMapping("/grupo/{grupoId}")
    public List<Alumno> listarPorGrupo(@PathVariable Long grupoId) {
        return repo.findByGrupoId(grupoId);
    }
    @PostMapping
    public Alumno guardar(@RequestBody Alumno alumno) {
        return repo.save(alumno);
    }

    @GetMapping("/{id}")
    public Alumno buscar(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Alumno actualizar(@PathVariable Long id, @RequestBody Alumno nuevo) {
        return repo.findById(id).map(a -> {
            a.setNombre(nuevo.getNombre());
            a.setDni(nuevo.getDni());
            a.setTelefono(nuevo.getTelefono());
            a.setGrupo(nuevo.getGrupo());
            return repo.save(a);
        }).orElse(null);
    }
}