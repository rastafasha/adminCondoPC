import { Component, ErrorHandler, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-usuarios-recientes',
   imports:[CommonModule,  NgxPaginationModule,
    ReactiveFormsModule, FormsModule, RouterLink
  ],
  templateUrl: './usuarios-recientes.component.html',
  styleUrls: ['./usuarios-recientes.component.css']
})
export class UsuariosRecientesComponent implements OnInit {

  users!: User;
  error!: string;
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getRecentUsers();
  }

  getRecentUsers(): void {
    this.userService.getRecientes().subscribe(
      res =>{
        this.users = res;
      }
    );
  }

}
