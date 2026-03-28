import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MenuiconosComponent } from '../../shared/menuiconos/menuiconos.component';
@Component({
  selector: 'app-dashboard-user',
  imports:[CommonModule, RouterLink, MenuiconosComponent],
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.css']
})
export class DashboardUserComponent implements OnInit {
  title = 'Admin Usuario';
  public user!: User;
  public userprofile!: User;
  displaycomponent: string = 'none';
  limit = 3;

  error!: string;

  uid:any;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.user = userService.usuario;
  }

  ngOnInit(): void {
    this.closeMenu();
    this.getUser();
    window.scrollTo(0,0);
    // this.getUserProfile();
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

  getUserProfile(){
    this.userService.getUserById(this.user.uid).subscribe(
      res =>{
        this.userprofile = res;
        console.log(this.userprofile)
      }
    );
    // if(this.user.profiles == null ){
    //   Swal.fire('Debes llenar tu perfil y aceptar las condiciones');
    // }
  }



}
