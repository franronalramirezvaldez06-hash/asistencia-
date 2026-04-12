import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno';
import { CrearGrupoComponent } from './components/crear-grupo/crear-grupo';
import { RegistrarAsistenciaComponent } from './components/registrar-asistencia/registrar-asistencia';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'crear-alumno', component: CrearAlumnoComponent },
  { path: 'crear-grupo', component: CrearGrupoComponent },
  // CAMBIO AQUÍ: Agrega el parámetro :id
  { path: 'registrar/:id', component: RegistrarAsistenciaComponent },
  // Opcional: Mantén la ruta simple por si entras directo
  { path: 'registrar', component: RegistrarAsistenciaComponent },
];