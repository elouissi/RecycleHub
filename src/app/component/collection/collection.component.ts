import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CollectionService} from "../../services/collection/collection.service";
import Swal from "sweetalert2";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent {
  collectionForm: FormGroup
  timeSlots: string[] = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ]

  constructor(private fb: FormBuilder,private collectionService:CollectionService,private authService: AuthService) {
    this.collectionForm = this.fb.group({
      requests: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.addRequest()
  }

  get requests() {
    return this.collectionForm.get("requests") as FormArray
  }
  getId(){
    return this.authService.getUserId();
  }

  addRequest() {
    if (this.requests.length < 3) {
      const newRequest = this.fb.group({
        wasteType: ["", Validators.required],
        photos: [""],
        weight: ["", [Validators.required, Validators.min(1000)]],
        address: ["", Validators.required],
        date: ["", Validators.required],
        timeSlot: ["", Validators.required],
        notes: [""],
        userId:[this.getId()],
      })
      this.requests.push(newRequest)
    }
  }

  showLoadingAlert() {
    return Swal.fire({
      title: 'Traitement en cours...',
      html: 'Veuillez patienter pendant la soumission des demandes',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  showSuccessAlert(message: string) {
    return Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }

  showErrorAlert(message: string) {
    return Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      confirmButtonColor: '#d33'
    });
  }

  showWarningAlert(message: string) {
    return Swal.fire({
      icon: 'warning',
      title: 'Attention',
      text: message,
      confirmButtonColor: '#f8bb86'
    });
  }



  onSubmit() {
    if (this.collectionForm.valid) {
      const demands = this.collectionForm.value.requests;
      let successCount = 0;
      let errorCount = 0;
      console.log(demands);
      const sommeDesPoids = this.collectionService.calculSommeDesPoids(demands);
      if (sommeDesPoids <= 10000){
        if (demands.length > 1) {
          console.log("Plusieurs demandes à traiter");
          this.showLoadingAlert();

          for(let i = 0; i < demands.length; i++) {
            console.log(`Traitement de la demande ${i + 1}`);

            this.collectionService.createDemand(demands[i]).subscribe({
              next: (response) => {
                console.log(`Demande ${i + 1} créée:`, response);
                successCount++;

                if (successCount + errorCount === demands.length) {
                  Swal.close();
                  if (errorCount === 0) {
                    this.showSuccessAlert("Toutes les demandes ont été soumises avec succès !")
                      .then(() => this.resetForm());
                  } else {
                    this.showWarningAlert(`${successCount} demande(s) soumise(s) avec succès et ${errorCount} erreur(s).`)
                      .then(() => this.resetForm());
                  }
                }
              },
              error: (error) => {
                console.error(`Erreur lors de la création de la demande ${i + 1}:`, error);
                errorCount++;

                if (successCount + errorCount === demands.length) {
                  Swal.close();
                  this.showWarningAlert(`${successCount} demande(s) soumise(s) avec succès et ${errorCount} erreur(s).`)
                    .then(() => this.resetForm());
                }
              }
            });
          }
        }
        else {
          this.showLoadingAlert();
          this.collectionService.createDemand(demands[0]).subscribe({
            next: (response) => {
              console.log('Demande créée:', response);
              Swal.close();
              this.showSuccessAlert("Demande de collecte soumise avec succès !")
                .then(() => this.resetForm());
            },
            error: (error) => {
              console.error('Erreur lors de la création de la demande:', error);
              Swal.close();
              this.showErrorAlert("Une erreur est survenue lors de la soumission de la demande.")
                .then(() => this.resetForm());
            }
          });
        }
      }else {
        this.showWarningAlert("vous avez dépasser le maximum du poid");
      }

    } else {
      this.showWarningAlert("Veuillez remplir correctement tous les champs obligatoires.");
    }
  }


  private resetForm() {
    this.collectionForm.reset();
    while (this.requests.length > 1) {
      this.requests.removeAt(1);
    }
  }
}



