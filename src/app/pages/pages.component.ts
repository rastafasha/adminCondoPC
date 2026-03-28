import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../shared/menu/menu.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';


// declare function customInitFunctions(); //llamammos a la funcion que carga los js

@Component({
  selector: 'app-pages',
  imports:[CommonModule, RouterOutlet, MenuComponent, HeaderComponent, FooterComponent],
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  year = new Date().getFullYear();

  public user!: User;
  id!:number;


  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.getUser();
  }




}
