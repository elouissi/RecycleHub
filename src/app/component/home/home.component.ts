import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService:AuthService) {}


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  isParticulier(): boolean {
    return this.authService.getRole()=="particulier"
  }


}
