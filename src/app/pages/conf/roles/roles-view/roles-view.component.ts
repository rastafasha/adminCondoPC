import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtnComponent } from '../../../../shared/backButtn/backButtn.component';
import { UserRolePipe } from '../../../../pipes/user-role.pipe';
import { AdminRolesPipe } from '../../../../pipes/admin-roles.pipe';
import { LoadingComponent } from '../../../../shared/loading/loading.component';
import { ModalinfoTiposPagoComponent } from '../../../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';

@Component({
  selector: 'app-roles-view',
  imports: [CommonModule, RouterLink, ReactiveFormsModule,
    FormsModule, NgxPaginationModule, BackButtnComponent,
    ModalinfoTiposPagoComponent,
    UserRolePipe, AdminRolesPipe, LoadingComponent],
  templateUrl: './roles-view.component.html',
  styleUrls: ['./roles-view.component.css']
})
export class RolesViewComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  title = "Roles";
  users: any;
  user!: User;
  role?: User;
  isLoading: boolean = false;

  p: number = 1;
  count: number = 8;

  error!: string;
  msm_error!: string;

  rolesSelected!: number;

  rolesForm!: FormGroup;

  option_selectedd: number = 1;
  solicitud_selectedd: any = 1;

  info = `
  <p>En esta sección podrás:</p>
          <ul>
            <li>Cambiar el Role a los usuarios que Pertenezcan al area Administrativa</li>
          </ul>`;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
    window.scrollTo(0, 0);
  }

  getUsers(): void {
    this.isLoading = true;
    this.userService.getUsuarios().subscribe(
      res => {
        this.users = res;
        this.isLoading = false;
      }
    );
  }

  cambiarRole(user: User) {
    this.userService.editarRole(user).subscribe(
      resp => {
        console.log(resp);
        Swal.fire('Actualizado', `actualizado rol correctamente`, 'success');
        this.getUsers();
      }
    )
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

}
