import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';


// declare const gapi: any;


@Component({
  selector: 'app-login',
  imports:[CommonModule, LoadingComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errors: any = null;
  roles: string[] = [];

  public auth2: any;
  isLoading: boolean = false;

  user!: User;
  loginForm: FormGroup;
  registerForm: FormGroup;


  // Registro

  public formSumitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UserService,
    private ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]

    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roles: ['USER_ROLE'],
      terminos: [true, Validators.required],

    }, {
      validators: this.passwordsIguales('password', 'confirmPassword')

    });
  }

  ngOnInit() {
    // this.renderButton();

  }
  login() {
    this.isLoading = true;
    this.usuarioService.login(this.loginForm.value).subscribe(
      resp => {
        // console.log('Login response:', resp);
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
        } else {
          localStorage.removeItem('email');
        }
        this.usuarioService.getLocalStorage();
        if (localStorage.getItem('user') !== 'undefined') {
          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 500);
        } else {
          this.router.navigateByUrl('/login');
        }


        // this.router.navigateByUrl('/my-account');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    )


  }





  // Registro
  crearUsuario() {
    this.formSumitted = true;
    this.isLoading = true;
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(
      resp => {
        this.isLoading = false;
        Swal.fire('Registrado!', `Ya puedes ingresar`, 'success');

        window.location.reload();
      }, (error) => {
        this.isLoading = false;
        Swal.fire('Error', error.error.msg, 'error');
        this.errors = error.error;
      }
    );
    return false;
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSumitted) {
      return true;
    } else {
      return false;
    }


  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSumitted;
  }

  passwordNoValido() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('confirmPassword')?.value;

    if ((pass1 !== pass2) && this.formSumitted) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null)
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    }
  }
  // Registro



}

