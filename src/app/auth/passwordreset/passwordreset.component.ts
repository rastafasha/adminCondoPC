import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-passwordreset',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  email = new FormControl();

  submitted = false;
  errors: any = null;

  public formSumitted = false;

  resetpaswordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) {
    this.resetpaswordForm = this.fb.group({
      email: [null, [Validators.required]],
      // terminos: [false, Validators.required],

    });
  }

  ngOnInit(): void {

  }

  resetPassword() {

    this.userService.forgotPassword(this.resetpaswordForm.value).subscribe(
      resp => {
        // console.log(resp);
        Swal.fire('Exito!', `Favor revisa tu Correo`, 'success');
      }, (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.errors = error.error.message;
      }
    )
    // console.log(this.user)
  }

}
