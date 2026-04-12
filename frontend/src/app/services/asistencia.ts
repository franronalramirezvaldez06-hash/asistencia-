import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080'; 

  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos`);
  }

  crearAlumno(alumno: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alumnos`, alumno);
  }

  getAlumnosPorGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos/grupo/${grupoId}`);
  }

  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos`);
  }

  crearGrupo(grupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos`, grupo);
  }

  registrarAsistencia(asistencia: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/asistencias`, asistencia);
  }


buscarAsistencias(grupoId: string | number, fecha: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/asistencias/buscar`, {
    params: { 
      grupoId: grupoId.toString(), 
      fecha 
    }
  });
  
}

eliminarAlumno(id: number) {
  return this.http.delete(`http://localhost:8080/alumnos/${id}`);
}

actualizarAlumno(alumno: any) {

  return this.http.put(`http://localhost:8080/alumnos/${alumno.id}`, alumno);
}
}