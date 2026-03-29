import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';
import { BackButtnComponent } from '../../shared/backButtn/backButtn.component';
import { Residencia } from '../../models/residencia';
import { Local } from '../../models/local';
import { Oficina } from '../../models/oficina';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-user-profile',
  imports:[CommonModule, RouterLink, ImagenPipe, BackButtnComponent, LoadingComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() displaycomponent: string = 'block';
  title = "Detalles de la cuenta";
  user!: User;
  profile!: Profile;
  error!: string;
  uid:any;
  local?: Local[];
  oficina?: Oficina[];
  residencia?: Residencia[];
  usuario?: User;
  isLoading: boolean = false;

  rolesSelected!:number;

  p: number = 1;
  count: number = 8;

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private location: Location,

  ) {
    this.usuario = userService.usuario;
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this.closeMenu();
    this.activatedRoute.params.subscribe( ({id}) => this.getUserRemoto(id));
    this.activatedRoute.params.subscribe( ({id}) => this.getProfile(id));
    
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }

 getUserRemoto(id:any){
    this.userService.getUserById(id).subscribe(
      res =>{
        this.user = res;
        // console.log(this.usuario);
      }
    );

  }
  getProfile(id:string){
    this.isLoading = true;
    this.profileService.getByUser(id).subscribe(
      res =>{
        this.profile = res;
        this.local = Array.isArray(res.local) ? res.local : [res.local];
        this.oficina = Array.isArray(res.oficina) ? res.oficina : [res.oficina];
        this.residencia = Array.isArray(res.residencia) ? res.residencia : [res.residencia];
        this.usuario = res.usuario;
        this.isLoading = false;
      }
    );

    
  }



  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  updateUser(userprofile: Profile){
    this.profileService.updateProfile(userprofile ).subscribe(
      resp =>{ console.log(resp);
        Swal.fire('Actualizado', `actualizado correctamente`, 'success');

      }
    )
  }

  
}
