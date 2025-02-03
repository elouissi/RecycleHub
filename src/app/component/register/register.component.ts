import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

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
    console.log("Inscription soumise", this.user)
    // Stocker les données dans le localStorage
    localStorage.setItem("user", JSON.stringify(this.user))
    alert("Inscription réussie ! Les données ont été stockées dans le localStorage.")
    // Ici, vous pourriez ajouter une redirection vers la page de connexion ou le tableau de bord
  }
}

