import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

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

  constructor(private fb: FormBuilder) {
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
      })
      this.requests.push(newRequest)
    }
  }

  onSubmit() {
    if (this.collectionForm.valid) {
      console.log(this.collectionForm.value)
      const values = this.collectionForm.value;
      const length = this.requests.length;
      alert("Demande(s) de collecte soumise(s) avec succès !")
      this.collectionForm.reset()
      while (this.requests.length > 1) {
        this.requests.removeAt(1)
      }
    } else {
      alert("Veuillez remplir correctement tous les champs obligatoires.")
    }
  }
}



