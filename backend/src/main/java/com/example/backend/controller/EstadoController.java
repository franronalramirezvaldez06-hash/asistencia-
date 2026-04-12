package com.example.backend.controller;

import com.example.backend.model.EstadoAsistencia;
import com.example.backend.repository.EstadoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estados")
@CrossOrigin
public class EstadoController {

    private final EstadoRepository repo;

    public EstadoController(EstadoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<EstadoAsistencia> listar() {
        return repo.findAll();
    }

    @PostMapping
    public EstadoAsistencia guardar(@RequestBody EstadoAsistencia estado){
        return repo.save(estado);
    }
}