import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  email = ""
  password = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.length > 0) {
          Swal.fire({
            icon: "success",
            title: "conexion réussie !",
            text: "Bienvenue.",
            confirmButtonText: "OK"
          });
          this.router.navigate(["/"])
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email ou mot de passe incorrect!",
          });
        }
      },
      error: (error) => {
        console.error("Erreur lors de la connexion", error)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
        });      },
    })
  }
}

