import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private asistenciaService = inject(AsistenciaService);

  grupos = signal<any[]>([]);
  asistenciasFiltradas = signal<any[]>([]);
  
 
  grupoSeleccionado = signal<string>('');
  fechaSeleccionada = signal<string>(new Date().toISOString().split('T')[0]);


  resumen = computed(() => {
    const lista = this.asistenciasFiltradas();
    return {
      total: lista.length,
      presentes: lista.filter(a => a.estado.nombre === 'Presente').length,
      tardanzas: lista.filter(a => a.estado.nombre === 'Tarde').length,
      faltas: lista.filter(a => a.estado.nombre === 'Falta').length,
      justificados: lista.filter(a => a.estado.nombre === 'Justificado').length
    };
  });

  ngOnInit() {
    this.cargarGrupos();
  }

  cargarGrupos() {
    this.asistenciaService.getGrupos().subscribe(data => this.grupos.set(data));
  }


  actualizarResumen() {
    if (this.grupoSeleccionado() && this.fechaSeleccionada()) {
      
      this.asistenciaService.buscarAsistencias(this.grupoSeleccionado(), this.fechaSeleccionada())
        .subscribe(data => this.asistenciasFiltradas.set(data));
    }
  }
}