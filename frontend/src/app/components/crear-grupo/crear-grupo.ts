import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';

@Component({
  selector: 'app-crear-grupo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-grupo.html',
  styleUrls: ['./crear-grupo.css']
})
export class CrearGrupoComponent implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  
  // Signals
  nombreGrupo = signal(''); 
  listaGrupos = signal<any[]>([]); 
  mostrarModal = signal(false); // Controla el formulario flotante

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.asistenciaService.getGrupos().subscribe(res => this.listaGrupos.set(res));
  }

  abrirModal() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.nombreGrupo.set('');
  }

  guardarGrupo() {
    if (!this.nombreGrupo().trim()) return;

    this.asistenciaService.crearGrupo({ nombre: this.nombreGrupo() }).subscribe({
      next: () => {
        this.cargarGrupos(); // Refresca la lista
        this.cerrarModal();   // Cierra el flotante
      },
      error: () => alert('Error al guardar')
    });
  }
}