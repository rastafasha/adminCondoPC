import { Component, Inject, Input } from '@angular/core';
import {  CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-backButtn',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './backButtn.component.html',
    styleUrls: ['./backButtn.component.css']
})
export class BackButtnComponent {
    // private _location = Inject(Location)
    @Input() pageTitle!:string;
    @Input() title!:string;
    @Input() displaycomponent: string = 'block';
    
    constructor(private _location: Location) {}

    goBack() {
        this._location.back();
      }
}