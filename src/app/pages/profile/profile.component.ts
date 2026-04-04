import { Component, OnInit, Output, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { FileUploadService } from '../../services/file-upload.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { ModalinfoTiposPagoComponent } from '../../components/modalinfo-tipos-pago/modalinfo-tipos-pago.component';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, ImagenPipe, ReactiveFormsModule,
    BackButtnComponent, LoadingComponent, ModalinfoTiposPagoComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  title = 'Perfil de Usuario';
  imagePath!: string;
  error!: string;
  uploadError!: boolean;
  isLoading: boolean = false;

  profileSeleccionado!: Profile;
  pageTitle!: string;

  userProfile!: User;
  profile: Profile;
  profileId!: string;
  _id!: string;
  uid!: string;

  p: number = 1;
  count: number = 8;


  passwordForm!: FormGroup;
  errors: any = null;
  infoProfile: any;

  public formSumitted = false;

  public storage = environment.apiUrlMedia

  public url: any;
  public user: any = {};
  public file !: File;
  public imgSelect !: String | ArrayBuffer;
  public data_paises: any = [];
  public msm_error = false;
  public msm_success = false;
  public pass_error = false;

  public usuario: User;

  public perfilForm!: FormGroup;
  public imagenSubir!: File;
  public imgTemp: any = null;

  public direcciones!: Profile[];

  //DATA
  public new_password = '';
  public comfirm_password = '';

  info = `
  <p>Hola!:</p>
  <p>Esta Aplicación agradeceria que completes todos los campos requeridos, para continuar con el proceso de acceso:</p>
          <ul>
            <li>Nombre y Apellido</li>
            <li>Teléfonos de Contacto</li>
            <li>Si deseas puedes subir tu foto</li>
          </ul>`;


  constructor(
    private location: Location,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,

  ) {
    this.usuario = this.userService.usuario;
    this.profile = this.profileService.profile;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    console.log('usuario', this.user);
    this.userService.closeMenu();
    this.validarFormularioPerfil();
    this.activatedRoute.params.subscribe(({ id }) => this.getUserProfile(id));
    this.iniciarFormularioPassword(this.user?.uid || '');

    // this.listar();

  }



  getUserProfile(id: string) {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe(
      res => {
        this.usuario = res;
        this.isLoading = false;
      }
    );

    this.activatedRoute.params.subscribe(({ id }) => this.listar(id));
    this.activatedRoute.params.subscribe(({ id }) => this.iniciarFormularioPerfil(id));

  }

  listar(id: string) {
    if (!id == null || !id == undefined || id) {
      this.profileService.listarUsuario(id).subscribe(
        response => {
          this.profile = response;
        }
      );
    } else {
      console.log('no hay registro')
    }

  }




  iniciarFormularioPerfil(id: string) {
    this.isLoading = true;
    if (!id == null || !id == undefined || id) {
      this.profileService.getByUser(id).subscribe(
        res => {
          this.perfilForm.patchValue({
            _id: res._id,
            first_name: this.profile.first_name,
            last_name: this.profile.last_name,
            direccion: this.profile.direccion,
            telhome: this.profile.telhome,
            telmovil: this.profile.telmovil,
            usuario: this.usuario.uid,
            img: this.profile.img
          });
          this.profileSeleccionado = res;

          this.isLoading = false;
        }
      );
    } else {
      this.pageTitle = 'Crear Perfil';
    }



  }

  validarFormularioPerfil() {
    this.perfilForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      telhome: ['', Validators.required],
      telmovil: ['', Validators.required],
      // usuario: [this.usuario.uid],
      id: [''],
      img: [''],
    });
  }

  get first_name() {
    return this.perfilForm.get('first_name');
  }

  get last_name() {
    return this.perfilForm.get('last_name');
  }

  get telmovil() {
    return this.perfilForm.get('telmovil');
  }


  cambiarImagen(file: File) {
    this.imagenSubir = file;

    // if (!file) {
    //   return this.imgTemp = null;
    // }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.isLoading = true;
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'profiles', this.profileSeleccionado._id || '')
      .then(img => {
        this.profile.img = img;
        Swal.fire('Guardado', 'La imagen fue actualizada', 'success');
        this.isLoading = false;
        this.ngOnInit()
      }).catch(err => {
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        this.isLoading = false;
        this.ngOnInit()
      })
  }



  guardarPerfil() {


    if (this.profile) {
      const data = {
        ...this.perfilForm.value,
        _id: this.profile._id,
        usuario: this.user.uid,
      }
      this.profileService.updateProfile(data).subscribe(
        res => {
          Swal.fire('Guardado', 'Los cambios fueron actualizados', 'success');
          this.ngOnInit();
        },
        error => this.errors = error
      );
    } else {
      const data = {
        ...this.perfilForm.value,
        usuario: this.user.uid
      }
      this.profileService.createProfile(data).subscribe(
        res => {
          Swal.fire('Guardado', 'Los cambios fueron creados', 'success');
          this.ngOnInit();
        },
        error => this.errors = error
      );
    }
    return false;
  }


  //Cambiar contraseña

  originalEmail: string = '';

  iniciarFormularioPassword(uid: string) {
    // const id = this.route.snapshot.paramMap.get('id');
    if (uid && uid.trim() !== '') {
      this.userService.getUserById(uid).subscribe(
        res => {
          this.passwordForm.patchValue({
            id: res.uid,
            email: res.email,
          });
          this.originalEmail = res.email;
        }
      );
    } else {
      this.pageTitle = 'Crear Directorio';
    }
    this.validarFormularioPassword();

  }

  validarFormularioPassword() {
    this.passwordForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
    }, {
      validators: [this.passwordsIguales('password', 'password2'), this.emailNoCambiado()]

    });
  }

  passwordNoValido() {
    const pass1 = this.passwordForm.get('password')?.value;
    const pass2 = this.passwordForm.get('password2')?.value;

    if ((pass1 !== pass2) && this.formSumitted) {
      return true;
    } else {
      return false;
    }
  }

  emailNoCambiado() {
    return (formGroup: FormGroup) => {
      const emailControl = formGroup.get('email');
      if (emailControl?.value !== this.originalEmail) {
        emailControl?.setErrors({ emailCambiado: true });
      } else {
        emailControl?.setErrors(null);
      }
    };
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

  cambiarPassword() {

    this.formSumitted = true;
    if (this.passwordForm.invalid || this.passwordForm.get('email')?.value !== this.originalEmail) {
      Swal.fire('Error', 'No puedes cambiar el email. Usa el email actual.', 'error');
      this.passwordForm.markAllAsTouched();
      return;
    }
    if (this.passwordForm.get('password')?.value === this.passwordForm.get('password2')?.value) {
      const data = {
        ...this.passwordForm.value,
        id: this.usuario?.uid || this.user.uid
      };
      // TODO: Implement actual password change API call, e.g.:
      // this.userService.changePassword(data.email, data).subscribe(...);
      Swal.fire('Éxito', 'Contraseña actualizada (simulada - completa API call).', 'success');
    } else {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
    }
  }


}
