import { Component, Input, OnInit } from '@angular/core';
import { Payment } from '../../models/payment';
import { User } from '../../models/user';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MenuiconosComponent } from '../../shared/menuiconos/menuiconos.component';
import { TasadiabcvComponent } from '../../components/tasadiabcv/tasadiabcv.component';
import { ModalinfoTiposPagoComponent } from '../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';
import { ModalInicialComponent } from "../../components/modal-inicial/modal-inicial.component";
import { PaymentsComponent } from "../payments/payments.component";
import { PieChartComponent } from '../../components/charts/pie-chart/pie-chart.component';
import { LineChartComponent } from '../../components/charts/line-chart/line-chart.component';
import { PieChart2Component } from '../../components/charts/pie-chart2/pie-chart2.component';
import { FacturacionService } from '../../services/facturacion.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, MenuiconosComponent,
    TasadiabcvComponent, ModalInicialComponent,
     PaymentsComponent, 
    ],
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
  paymentSeleccionado!:Payment|null;
  
  

  constructor(
    private userService: UserService,
    private payentService: PaymentService,
    
    

  ) {
    this.user = userService.usuario;
  }

  ngOnInit(): void {

    this.userService.closeMenu();
    this.getUser();
    this.getPPaymentsData();
    this.subscribeToFilteredPPayments();
    window.scrollTo(0,0);
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

  // closeMenu(){
  //   var menuLateral = document.getElementsByClassName("sidebar");
  //     for (var i = 0; i<menuLateral.length; i++) {
  //        menuLateral[i].classList.remove("active");

  //     }
  // }

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

  openEditModal(): void {
    this.selectedPayment = null;
  }

  onCloseModal(): void {
    this.paymentSeleccionado = null;
  }

  PageSize() {
    this.getPPaymentsData();

  }
  
}
