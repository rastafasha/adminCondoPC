import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';

@Component({
  selector: 'app-roles-view',
  imports:[CommonModule, RouterLink, ReactiveFormsModule, 
    FormsModule, NgxPaginationModule ],
  templateUrl: './roles-view.component.html',
  styleUrls: ['./roles-view.component.css']
})
export class RolesViewComponent implements OnInit {

   title = "Roles";
  users: any;
  user!: User;
  role?: User;

  p: number = 1;
  count: number = 8;

  error!: string;
  msm_error!: string;

  rolesSelected!:number;

  rolesForm!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private userService: UserService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getUsers();
    window.scrollTo(0,0);
  }

  getUsers(): void {
    this.userService.getUsuarios().subscribe(
      res =>{
        this.users = res;
      }
    );
  }

  cambiarRole(user: User){
    this.userService.editarRole(user).subscribe(
      resp =>{ console.log(resp);
        Swal.fire('Actualizado', `actualizado rol correctamente`, 'success');
        this.getUsers();
      }
    )
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
