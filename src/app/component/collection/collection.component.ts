import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from "sweetalert2";
import { CollectionService } from "../../services/collection/collection.service";
import { NgForOf, NgIf } from "@angular/common";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: "app-collection",
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf],
  templateUrl: "./collection.component.html",
  styleUrl: "./collection.component.css",
})
export class CollectionComponent implements OnInit {
  collectionForm!: FormGroup;
  wasteTypes = ['plastique', 'verre', 'papier', 'metal'];
  selectedWasteTypes: Set<string> = new Set();
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
  ];

  constructor(private fb: FormBuilder, private collectionService: CollectionService,private authService: AuthService) { }

  validateTotalWeight(control: AbstractControl): ValidationErrors | null {
    const wasteArray = control as FormArray;
    const totalWeight = wasteArray.controls.reduce((total, control) => {
      const weight = Number(control.get('weight')?.value) || 0;
      return total + weight;
    }, 0);
    return totalWeight > 10000 ? { maxTotalWeight: true } : null;
  }

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      wasteTypes: this.fb.array([], [this.validateTotalWeight.bind(this)]),
      address: ['', Validators.required],
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      notes: ['', Validators.required],
      status:["En cours"],
      totalWeight: [0,Validators.max(10000)],
      userId:[this.authService.getUserId()]
    });


    console.log(this.collectionForm.get('totalWeight')?.value);

    this.addWasteType();
    this.updateTotalWeight();
    (this.collectionForm.get('wasteTypes') as FormArray).valueChanges.subscribe(() => {
      this.collectionForm.get('wasteTypes')?.updateValueAndValidity();
    });
    (this.collectionForm.get('wasteTypes') as FormArray).valueChanges.subscribe(() => {
      this.updateTotalWeight();
    });
  }
  getUserId(){
    return this.authService.getUserId()
  }

  updateTotalWeight() {
    const totalWeight = this.calculateTotalWeight();
    this.collectionForm.get('totalWeight')?.setValue(totalWeight);
  }

  getWasteTypesControls() {
    return (this.collectionForm.get('wasteTypes') as FormArray).controls;
  }

  calculateTotalWeight(): number {
    const wasteArray = this.collectionForm.get('wasteTypes') as FormArray;

    return wasteArray.controls.reduce((total, control) => {
      const weight = Number(control.get('weight')?.value) || 0;
      return total + weight;
    }, 0);
  }

  addWasteType(): void {
    const wasteArray = this.collectionForm.get('wasteTypes') as FormArray;
    if (wasteArray.length >= 4) {
      this.showWarningAlert("Vous ne pouvez pas ajouter plus de 4 types de déchets.");
      return;
    }

    const newWasteType = this.fb.group({
      type: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(1000)]]
    });

    wasteArray.push(newWasteType);
  }

  checkTypeDuplication(index: number): void {
    const wasteArray = this.collectionForm.get('wasteTypes') as FormArray;
    const selectedType = wasteArray.at(index).get('type')?.value;

    if (selectedType) {
      const duplicateExists = wasteArray.controls.some((control, i) =>
        i !== index && control.get('type')?.value === selectedType
      );

      if (duplicateExists) {
        wasteArray.at(index).get('type')?.setValue('');
        this.showWarningAlert('Ce type de déchet est déjà sélectionné. Veuillez en choisir un autre.');
      }
    }
    this.updateAvailableTypes();
  }

  removeWasteType(index: number): void {
    const wasteArray = this.collectionForm.get('wasteTypes') as FormArray;
    const removedType = wasteArray.at(index).get('type')?.value;
    if (removedType) {
      this.selectedWasteTypes.delete(removedType);
    }
    wasteArray.removeAt(index);
    this.updateAvailableTypes();
  }

  updateAvailableTypes(): void {
    this.selectedWasteTypes.clear();
    const wasteArray = this.collectionForm.get('wasteTypes') as FormArray;
    wasteArray.controls.forEach(control => {
      const selectedType = control.get('type')?.value;
      if (selectedType) {
        this.selectedWasteTypes.add(selectedType);
      }
    });
  }

  getAvailableWasteTypes(index: number): string[] {
    const currentType = (this.collectionForm.get('wasteTypes') as FormArray).at(index).get('type')?.value;
    return this.wasteTypes.filter(type => !this.selectedWasteTypes.has(type) || type === currentType);
  }

  onSubmit() {
    if (this.collectionForm.valid) {
      this.collectionService.getPendingDemands(this.authService.getUserId()).subscribe((pendingRequests: any[]) => {
        console.log(pendingRequests);
        if (pendingRequests.length >= 3) {
          this.showWarningAlert("Vous ne pouvez pas avoir plus de 3 demandes en cours.");
          return;
        }

        const totalWeight = this.calculateTotalWeight();
        const demand = {
          ...this.collectionForm.value,
          totalWeight
        };

        this.showLoadingAlert();
        console.log(demand)
        this.collectionService.createDemand(demand).subscribe({
          next: () => {
            Swal.close();
            this.showSuccessAlert("Demande de collecte soumise avec succès !").then(() =>
              this.collectionForm.reset());
          },
          error: () => {
            Swal.close();
            this.showErrorAlert("Une erreur est survenue lors de la soumission de la demande.");
          }
        });

      }, error => {
        this.showErrorAlert("Erreur lors de la récupération des demandes en cours.");
      });

    } else {
      if (this.collectionForm.get('wasteTypes')?.hasError('maxTotalWeight')) {
        this.showWarningAlert("Le poids total dépasse le maximum autorisé de 10000g");
      } else {
        this.showWarningAlert("Veuillez remplir correctement tous les champs obligatoires.");
      }
    }
  }

  showLoadingAlert() {
    return Swal.fire({
      title: "Traitement en cours...",
      html: "Veuillez patienter pendant la soumission des demandes",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    });
  }

  showSuccessAlert(message: string) {
    return Swal.fire({
      icon: "success",
      title: "Succès!",
      text: message,
      confirmButtonColor: "#3085d6",
    });
  }

  showErrorAlert(message: string) {
    return Swal.fire({
      icon: "error",
      title: "Erreur",
      text: message,
      confirmButtonColor: "#d33",
    });
  }

  showWarningAlert(message: string) {
    return Swal.fire({
      icon: "warning",
      title: "Attention",
      text: message,
      confirmButtonColor: "#f8bb86",
    });
  }
}
