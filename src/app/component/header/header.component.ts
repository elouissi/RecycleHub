import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FlowbiteService} from "../../services/flowbite.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false


  constructor(private flowbiteService: FlowbiteService,private authService:AuthService) {}

  get username(): string | null {
    return this.authService.getUsername();
  }
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    return this.authService.logout();

  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }
}
