import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { PublicHomeComponent } from './components/public-home/public-home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { PuntoVentaComponent } from './components/punto-venta/punto-venta.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { HistorialInventarioComponent } from './components/historial-inventario/historial-inventario.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { HomeRouterComponent } from './components/home-router/home-router.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { HomeEmpleadoComponent } from './components/home-empleado/home-empleado.component';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { GestionBannersComponent } from './components/gestion-banners/gestion-banners.component';

export const routes: Routes = [
  { path: '', component: PublicHomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: HomeRouterComponent, canActivate: [authGuard] },
  { path: 'admin-home', component: HomeAdminComponent, canActivate: [authGuard] },
  { path: 'empleado-home', component: HomeEmpleadoComponent, canActivate: [authGuard] },
  { path: 'cliente-home', component: HomeClienteComponent, canActivate: [authGuard] },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'punto-venta', component: PuntoVentaComponent, canActivate: [authGuard] },
  { path: 'reportes', component: ReportesComponent, canActivate: [authGuard] },
  { path: 'historial-inventario', component: HistorialInventarioComponent, canActivate: [authGuard] },
  { path: 'gestion-usuarios', component: GestionUsuariosComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'gestion-banners', component: GestionBannersComponent, canActivate: [authGuard], data: { roles: ['ADMIN'] } }
];