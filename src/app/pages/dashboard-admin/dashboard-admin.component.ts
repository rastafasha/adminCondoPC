import { Component, Input, OnInit } from '@angular/core';
import { Payment } from '../../models/payment';
import { User } from '../../models/user';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MenuiconosComponent } from '../../shared/menuiconos/menuiconos.component';
import { TasadiabcvComponent } from '../../components/tasadiabcv/tasadiabcv.component';

@Component({
  selector: 'app-dashboard-admin',
  imports:[CommonModule, MenuiconosComponent, TasadiabcvComponent],
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
    private projectService: PaymentService,
    

  ) {
    this.user = userService.usuario;
  }

  ngOnInit(): void {

    this.closeMenu();
    this.getUser();
    this.getProjectsData();
    // this.subscribeToFilteredProjects();
    window.scrollTo(0,0);
  }

  getProjectsData(){
    this.projectService.getPayments().subscribe((resp:any)=>{
      this.payments = resp;
    })
  }

  onEditProject(payment: Payment) {
    this.selectedPayment = payment;
  }
  onDeleteProject(payment: Payment) {
    this.selectedPayment = payment;
  }

  subscribeToFilteredProjects() {
    // this.projectService.filteredProjects$.subscribe((filteredProjects: Project[]) => {
    //   if (filteredProjects && filteredProjects.length > 0) {
    //     this.projects = filteredProjects;
    //   } else {
    //     this.getProjectsData();
    //   }
    // });
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
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

  openEditModal(): void {
    this.selectedPayment = null;
  }

  onCloseModal(): void {
    this.paymentSeleccionado = null;
  }

  PageSize() {
    this.getProjectsData();

  }
  
}
