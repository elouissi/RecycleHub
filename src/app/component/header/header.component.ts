import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FlowbiteService} from "../../services/flowbite.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false


  constructor(private flowbiteService: FlowbiteService,private authService:AuthService) {}


  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    return this.authService.logout();

  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }
  getEmail() {
    return this.authService.getUserEmail();
  }
  getFirst() {
    return this.authService.getUserFirst();
  }
  getId(){
    return this.authService.getUserId();
  }

}
