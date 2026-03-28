import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { RouterLink } from '@angular/router';
import { BackButtnComponent } from '../../../shared/backButtn/backButtn.component';


@Component({
  selector: 'app-configuraciones',
  imports:[CommonModule, RouterLink, BackButtnComponent],
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent implements OnInit, DoCheck {
  @Input() displaycomponent: string = 'block';
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
