import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { Profile } from '../../models/profile';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from '../../pipes/imagen.pipe';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ImagenPipe],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  private linktTheme = document.querySelector('.dark');// se comunica el id pulsado

  userprofile!: any;
  user: User;
  error!: string;
  id:any;
  profile!: Profile;

  constructor(
    private usuarioService: UserService,
    private router: Router,
    private profileService: ProfileService,
    ) {
      this.user = usuarioService.usuario;
    }

  ngOnInit() {
    let USER = localStorage.getItem("user");
    this.user = USER ? JSON.parse(USER) : null;
    // console.log(this.user);
    if(!this.user || !this.user.uid || this.user.uid == null || this.user.uid == undefined){
      this.router.navigateByUrl('/login');
    }
      this.id = this.user.uid;
    //verifica que se hallan logueado
    if(!this.user || !this.user.uid){
      this.router.navigateByUrl('/login');
    }

    this.listar();
    // localStorage.setItem('dark', 'dark');
    
    if (localStorage.getItem('dark')) {
      this.darkmode('dark');
    }
  }

  


  listar(){
    this.profileService.listarUsuario(this.user.uid).subscribe(
      response =>{
        this.profile = response;
      }
    );
    
  }

  openModal(){
    var modalcart = document.getElementsByClassName("dropdown-menu");
      for (var i = 0; i<modalcart.length; i++) {
         modalcart[i].classList.toggle("show");
      }
  }


  openMenu(){

    var menuLateral = document.getElementsByClassName("mini-sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.toggle("show-sidebar");
      }
  }

  

  logout(){
    this.usuarioService.logout();
  }

  darkmode(dark:string){
    let body = document.querySelector('body');
    let header = document.querySelector('header');
    let aside = document.querySelector('aside');

    const classExists = document.getElementsByClassName(
      'dark'
     ).length > 0;

    var dayNight = document.getElementsByClassName("dayNight");
      for (var i = 0; i<dayNight.length; i++) {
        dayNight[i].classList.toggle("active");
        body?.classList.toggle('dark');
        header?.classList.toggle('dark');
        aside?.classList.toggle('dark');

      }
      // localStorage.setItem('dark', dark);

      if (classExists) {
        localStorage.removeItem('dark');
        // console.log('✅ class exists on page, removido');
      } else {
        localStorage.setItem('dark', dark);
        // console.log('⛔️ class does NOT exist on page, agregado');
      }
      // console.log('Pulsado');
  }


}
