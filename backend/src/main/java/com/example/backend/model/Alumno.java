package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true, length = 8, nullable = false)
    private String dni;

    private String telefono;

    @ManyToOne
    @JoinColumn(name = "id_grupo")
    private Grupo grupo;
}