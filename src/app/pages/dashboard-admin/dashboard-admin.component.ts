import { Component, inject, Input, OnInit } from '@angular/core';
import { Payment } from '../../models/payment';
import { User } from '../../models/user';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MenuiconosComponent } from '../../shared/menuiconos/menuiconos.component';
import { TasadiabcvComponent } from '../../components/tasadiabcv/tasadiabcv.component';
import { ModalInicialComponent } from "../../components/modal-inicial/modal-inicial.component";
import { PaymentsComponent } from "../payments/payments.component";
import { ModalNotificacionesComponent } from "../../components/modal-notificaciones/modal-notificaciones.component";
import { ComunicadoService } from '../../services/comunicado.service';
import { PwaNotifInstallerComponent } from "../../shared/pwa-notif-installer/pwa-notif-installer.component";

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, MenuiconosComponent,
    TasadiabcvComponent, ModalInicialComponent,
    PaymentsComponent, ModalNotificacionesComponent, PwaNotifInstallerComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  @Input() payments: Payment[] = [];

 

  title = 'Panel Administrativo';
  public user: User;
  public profile!: User;
  displaycomponent: string = 'none';
  limit = 3;

  error!: string;
  uid:any;

  usuarios!: User;
  usuario!: User;
  query:string ='';
  selectedPayment!:Payment|null;
  notificacionSeleccionado: any = null;
  
   private userService = inject(UserService); // Usas el servicio que creamos
   private payentService = inject(PaymentService); // Usas el servicio que creamos
   private _comunicadosService = inject(ComunicadoService); // Usas el servicio que creamos

  constructor(
  ) {
    this.user = this.userService.usuario;
  }

 

  ngOnInit(): void {
    
    window.scrollTo(0,0);
    this.userService.closeMenu();
    this.getUser();
    this.getPPaymentsData();
    this.subscribeToFilteredPPayments();
    
  }

  getPPaymentsData(){
    this.payentService.getPayments().subscribe((resp:any)=>{
      this.payments = resp;
    })
  }

  

  onEditProject(payment: Payment) {
    this.selectedPayment = payment;
  }
  onDeleteProject(payment: Payment) {
    this.selectedPayment = payment;
  }

  subscribeToFilteredPPayments() {
    this.payentService.filteredProjects$.subscribe((filteredProjects: Payment[]) => {
      if (filteredProjects && filteredProjects.length > 0) {
        this.payments = filteredProjects;
      } else {
        this.getPPaymentsData();
      }
    });
  }


  getUser(): void {

    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.uid = this.user.uid;
  }

  getUserRemoto(id:string){
    this.userService.getUserById(id).subscribe(
      res =>{
        this.usuario = res;
      }
    );
  }

  openNotificacionesModal(): void {
  this.notificacionSeleccionado = null; // Para que el hijo sepa que es una NUEVA
}

 onCloseModal(): void {
  this.notificacionSeleccionado = null;
}

  PageSize() {
    this.getPPaymentsData();

  }



}
