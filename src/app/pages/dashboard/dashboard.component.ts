import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { DashboardAdminComponent } from '../dashboard-admin/dashboard-admin.component';
import { DashboardUserComponent } from '../dashboard-user/dashboard-user.component';


@Component({
  selector: 'app-dashboard',
  imports:[CommonModule, DashboardAdminComponent, DashboardUserComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'Panel Administrativo';
  public user: User;
  id!:number;
  roleid!:number;

  error!: string;


  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.user = userService.usuario;
  }

  ngOnInit(): void {
    this.closeMenu();
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }



}
