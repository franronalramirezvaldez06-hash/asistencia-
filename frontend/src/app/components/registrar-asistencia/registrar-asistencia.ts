import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AsistenciaService } from '../../services/asistencia';

@Component({
  selector: 'app-registrar-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-asistencia.html',
  styleUrls: ['./registrar-asistencia.css'] 
})
export class RegistrarAsistenciaComponent implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  fechaHoy = new Date().toISOString().split('T')[0];
  idGrupoSeleccionado = signal<number | null>(null);
  guardando = signal(false);
  guardado  = signal(false);
  

  alumnos = signal<any[]>([]);
  grupos = signal<any[]>([]);


  estados = [
    { id: 1, nombre: 'P', titulo: 'Presente' },
    { id: 2, nombre: 'T', titulo: 'Tarde' },
    { id: 3, nombre: 'F', titulo: 'Falta' },
    { id: 4, nombre: 'J', titulo: 'Justificado' },
  ];

  ngOnInit() {
    this.cargarGrupos();


    const idUrl = Number(this.route.snapshot.paramMap.get('id'));
    if (idUrl) {
      this.idGrupoSeleccionado.set(idUrl);
      this.cargarDatosCombinados();
    }
  }

  cargarGrupos() {
    this.asistenciaService.getGrupos().subscribe({
      next: (data) => this.grupos.set(data),
      error: (err) => console.error('Error grupos:', err)
    });
  }

  onGrupoChange(event: any) {
    const id = Number(event.target.value);
    if (id) {
      this.idGrupoSeleccionado.set(id);
      this.cargarDatosCombinados();

      this.router.navigate(['/registrar', id], { replaceUrl: true });
    } else {
      this.alumnos.set([]);
      this.idGrupoSeleccionado.set(null);
    }
  }

  cargarDatosCombinados() {
    const grupoId = this.idGrupoSeleccionado();
    const fecha = this.fechaHoy;

    if (!grupoId) return;

   
    this.asistenciaService.buscarAsistencias(grupoId, fecha).subscribe({
      next: (asistenciasYaGuardadas) => {
        
        this.asistenciaService.getAlumnosPorGrupo(grupoId).subscribe(alumnosDelGrupo => {
          
          const mapaDeEstados = new Map(asistenciasYaGuardadas.map((a: any) => [a.alumno.id, a.estado.id]));

          const listaSincronizada = alumnosDelGrupo.map(alumno => ({
            ...alumno,
            estado: mapaDeEstados.get(alumno.id) || null
          }));

          this.alumnos.set(listaSincronizada);
        });
      }
    });
  }

  marcar(alumno: any, estadoId: number) {
    alumno.estado = (alumno.estado === estadoId) ? null : estadoId;
  }

  get resumen() {
    const lista = this.alumnos();
    return {
      presentes:    lista.filter(a => a.estado === 1).length,
      tardanzas:    lista.filter(a => a.estado === 2).length,
      faltas:       lista.filter(a => a.estado === 3).length,
      justificados: lista.filter(a => a.estado === 4).length,
      pendientes:   lista.filter(a => a.estado === null).length
    };
  }

  guardarAsistencia() {
    if (this.alumnos().length === 0) return;
    
    if (this.resumen.pendientes > 0) {
      if (!confirm(`Faltan ${this.resumen.pendientes} alumnos por marcar. ¿Guardar así?`)) return;
    }

    this.guardando.set(true);

    const datosParaEnviar = this.alumnos()
      .filter(a => a.estado !== null)
      .map(a => ({
        fecha:  this.fechaHoy,
        alumno: { id: a.id },
        estado: { id: a.estado },
      }));

    this.asistenciaService.registrarAsistencia(datosParaEnviar).subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardado.set(true);
        setTimeout(() => {
          this.guardado.set(false);
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.guardando.set(false);
        alert('Ocurrió un error al procesar la asistencia.');
      }
    });
  }
}