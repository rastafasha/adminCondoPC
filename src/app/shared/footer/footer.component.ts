import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
