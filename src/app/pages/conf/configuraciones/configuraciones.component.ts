import { Component, OnInit, DoCheck } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-configuraciones',
  imports:[CommonModule, RouterLink],
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit, DoCheck {

  title = "Configuraciones";
  error!: string;

  user!: User;

  constructor(
    private location: Location,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.closeMenu();
    window.scrollTo(0,0);
  }

  closeMenu(){
    var menuLateral = document.getElementsByClassName("sidebar");
      for (var i = 0; i<menuLateral.length; i++) {
         menuLateral[i].classList.remove("active");

      }
  }


  ngDoCheck(): void {
    this.user = this.userService.usuario;
  }


  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }


}
