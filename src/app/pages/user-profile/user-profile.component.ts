import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { ImagenPipe } from '../../pipes/imagen.pipe';

@Component({
  selector: 'app-user-profile',
  imports:[CommonModule, RouterLink, ImagenPipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  title = "Detalles de la cuenta";
  usuario: User;
  user!: User;
  profile!: Profile;
  error!: string;
  uid:any;

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
        this.usuario = res;
        // console.log(this.usuario);
      }
    );

  }

  getProfile(id:string){
    
    this.profileService.getByUser(id).subscribe(
      res =>{
        this.profile = res;
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
