import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionesComponent } from './conf/configuraciones/configuraciones.component';
import { RolesViewComponent } from './conf/roles/roles-view/roles-view.component';

//pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';
import { PaymentsComponent } from './payments/payments.component';
import { TransferenciasComponent } from './payments/transferencias/transferencias.component';
import { FacturacionComponent } from './payments/facturacion/facturacion.component';
// import { CondicionesComponent } from './condiciones/condiciones.component';




const childRoutes: Routes = [

    { path: '',  component: DashboardComponent, data:{title:'Dashboard'} },
    //auth

    //configuraciones
    { path: 'configuraciones',  component: ConfiguracionesComponent, data:{title:'Configuraciones'} },
    { path: 'buscar', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'buscar/:termino', component: BusquedaComponent, data:{tituloPage:'Busquedas'} },
    { path: 'rolesconf', component: RolesViewComponent, data:{title:'Planes'} },


    { path: 'projects', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'projects/:id', component: ProjectListComponent, data:{title:'Proyecto'} },
    { path: 'project/crear', component: ProjectEditComponent, data:{title:'Crear Proyecto'} },
    { path: 'project/edit/:id', component: ProjectEditComponent, data:{title:'Editar Proyecto'} },
    
    { path: 'payments', component: PaymentsComponent, data:{title:'Pagos'} },
    // { path: 'payments/:id', component: PaymentDetailsComponent, data:{title:'Pago'} },
    // { path: 'payment/crear', component: ReportarPagoComponent, data:{title:'Crear Pago'} },
    // { path: 'payment/edit/:id', component: ReportarPagoComponent, data:{title:'Editar Pago'} },
    // { path: 'payment-detail/:id', component: PaymentDetailsComponent, data:{title:'Revisar Pago'} },
    
    { path: 'trasnferencias', component: TransferenciasComponent, data:{title:'Transferencias'} },
    { path: 'facturacion', component: FacturacionComponent, data:{title:'Facturación'} },
  
    //user
    { path: 'users', component: UsersComponent, data:{title:'Usuarios'} },
    { path: 'user/:id', component: UserProfileComponent, data:{title:'Detalle Usuario'} },
    { path: 'user/edit/:id', component: UserProfileComponent, data:{title:'Editar Usuario'} },
    // { path: 'condiciones/:id', component: CondicionesComponent, data:{title:'Editar Usuario'} },
    // { path: 'user/edit/:id', component: UserDetailsComponent, data:{title:'Editar Usuario'} },
    { path: 'profile/:id',  component: ProfileComponent, data:{title:'Perfil'} },

    { path: 'search/:searchItem', component: UsersComponent, data:{title:'Buscar'} },
    
   

    { path: '**', component:  DashboardComponent },

]

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoute),
    RouterModule.forChild(childRoutes),
  ],
    exports: [ RouterModule ]
})
export class ChildRoutesModule { }
