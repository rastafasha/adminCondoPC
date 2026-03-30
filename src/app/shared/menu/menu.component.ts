import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu.component.html',
  styles: []
})


export class MenuComponent implements OnInit {

  @ViewChild('sidenav') sidenav: any;

  public user: User;

  error!: string;
  id: any;
  roleid!: number;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.user = userService.usuario;
  }

  ngOnInit(): void {
     let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    this.id = this.user.uid;
  }


  toggleNav() {
    this.sidenav.toggle();
  }


  logout(): void {
    this.userService.logout();
  }

}
