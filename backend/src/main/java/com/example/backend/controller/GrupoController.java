package com.example.backend.controller;

import com.example.backend.model.Grupo;
import com.example.backend.repository.GrupoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grupos")
@CrossOrigin
public class GrupoController {

    private final GrupoRepository repo;

    public GrupoController(GrupoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Grupo> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Grupo guardar(@RequestBody Grupo grupo) {
        return repo.save(grupo);
    }
}