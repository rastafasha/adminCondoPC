import { Component, OnInit } from '@angular/core';

import { HttpBackend, HttpClient, HttpHandler } from '@angular/common/http';

import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { BusquedasService } from '../../services/busqueda.service';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserRolePipe } from '../../pipes/user-role.pipe';
import { AdminRolesPipe } from '../../pipes/admin-roles.pipe';
import { ModalFacturaMasivaComponent } from '../../components/modal-factura-masiva/modal-factura-masiva.component';
import { ModalinfoTiposPagoComponent } from '../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';

@Component({
  selector: 'app-users',
  imports:[CommonModule, RouterLink, BackButtnComponent, NgxPaginationModule,
    ReactiveFormsModule, FormsModule, UserRolePipe, AdminRolesPipe,ModalFacturaMasivaComponent,
    ModalinfoTiposPagoComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  title = "Usuarios"

  loading = false;
  usersCount = 0;
  usuarios: any;
  user!: User;
  roles:any;

  p: number = 1;
  count: number = 8;

  error!: string;
  msm_error!: string;

  option_selectedd: number = 1;
    solicitud_selectedd: any = 1;
  ServerUrl = environment.apiUrl;
  query:string ='';

  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Ver Todos los usuarios </li>
            <li>Ver a detalle cada Cliente</li>
            <li>Encontrar Cliente por varias opciones</li>
            <li>Generar La Facturación por cada cliente individual</li>
            <li>Generar La Facturación Masiva a todos los Clientes</li>
          </ul>`;

  constructor(
    private userService: UserService,
    private busquedasService: BusquedasService,
    private location: Location,
    private http: HttpClient,
    handler: HttpBackend,
    
    ) {
      this.http = new HttpClient(handler);
    }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.closeMenu();
    this.getUsers();
    this.getUser();
  }

  getUser(): void {
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
  }

  getUsers(): void {
    this.userService.getUsuarios().subscribe(
      res =>{
        this.usuarios = res;
      }
    );
  }
  PageSize() {
    this.getUsers();

  }


  eliminarUser(user:User){
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No podras recuperarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteById(user).subscribe(
          response =>{
            this.getUsers();
          }
          );
        Swal.fire(
          'Borrado!',
          'El Archivo fue borrado.',
          'success'
        )
        this.ngOnInit();
      }
    });
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }

  search() {

    if(!this.query){
      this.ngOnInit();
    }else{
      this.busquedasService.searchGlobal(this.query).subscribe(
        (resp:any) => {
          this.usuarios = resp.usuarios;
        }
      );
    }

  }

  optionSelected(value: number) {
     this.option_selectedd = value;
     if (this.option_selectedd === 1) {
 
       // this.ngOnInit();
     }
     if (this.option_selectedd === 2) {
       this.solicitud_selectedd = null;
     }
   }

   abrirModalMasivo(){}



}
