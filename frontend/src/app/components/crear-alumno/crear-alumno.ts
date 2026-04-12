import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AsistenciaService } from '../../services/asistencia'; 

@Component({
  selector: 'app-crear-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-alumno.html',
  styleUrls: ['./crear-alumno.css']
})
export class CrearAlumnoComponent implements OnInit {
  private asistenciaService = inject(AsistenciaService);

  grupos = signal<any[]>([]);
  listaAlumnos = signal<any[]>([]);
  idGrupoFiltro = signal<string>('');
  mostrarModal = signal(false);
  editando = signal(false); // Para saber si estamos editando o creando

  // Un solo objeto para el formulario
  alumnoForm = { id: null, nombre: '', dni: '', telefono: '', grupo: { id: 0 } };

  ngOnInit() { this.cargarGrupos(); }

  cargarGrupos() {
    this.asistenciaService.getGrupos().subscribe(data => {
      this.grupos.set(data);
      if (data.length > 0) {
        this.idGrupoFiltro.set(data[0].id.toString());
        this.cargarAlumnosDelGrupo();
      }
    });
  }

  cargarAlumnosDelGrupo() {
    this.asistenciaService.getAlumnosPorGrupo(Number(this.idGrupoFiltro()))
      .subscribe(data => this.listaAlumnos.set(data));
  }

  abrirModal() {
    this.editando.set(false);
    this.alumnoForm = { id: null, nombre: '', dni: '', telefono: '', grupo: { id: Number(this.idGrupoFiltro()) } };
    this.mostrarModal.set(true);
  }

  editarAlumno(alumno: any) {
    this.editando.set(true);
    // Clonamos el alumno para no editar la fila directamente antes de guardar
    this.alumnoForm = { ...alumno, grupo: { id: alumno.grupo.id } };
    this.mostrarModal.set(true);
  }

  cerrarModal() { this.mostrarModal.set(false); }

  eliminarAlumno(id: number) {
    if (confirm('¿Estás seguro de eliminar a este alumno?')) {
      this.asistenciaService.eliminarAlumno(id).subscribe(() => {
        this.cargarAlumnosDelGrupo();
      });
    }
  }

  guardar() {
    const peticion = this.editando() 
      ? this.asistenciaService.actualizarAlumno(this.alumnoForm) // Debes tenerlo en tu service
      : this.asistenciaService.crearAlumno(this.alumnoForm);

    peticion.subscribe({
      next: () => {
        this.cargarAlumnosDelGrupo();
        this.cerrarModal();
      },
      error: () => alert('Error al procesar la solicitud')
    });
  }
}