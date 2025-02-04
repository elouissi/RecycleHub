import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  user = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    birthDate: "",
    profilePicture: null as string | null,
  }
  constructor(private authService: AuthService,private router:Router) {
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.user.profilePicture = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  onSubmit() {
    // Validation de base
    if (!this.user.email || !this.user.password || !this.user.firstName || !this.user.lastName) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log("Inscription réussie", response);
        this.router.navigate(["/login"]); // Ou à où vous voulez rediriger
      },
      error: (error) => {
        console.error("Erreur lors de l'inscription", error);
        alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    });
  }}

