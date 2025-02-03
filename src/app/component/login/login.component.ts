import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

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

  onSubmit() {
    console.log("Connexion soumise", { email: this.email, password: this.password })
    // Ici, vous ajouteriez la logique pour envoyer les identifiants à votre backend
  }
}

