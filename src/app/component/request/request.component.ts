import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import Swal from "sweetalert2";
import {CollectionRequest, CollectionService} from "../../services/collection/collection.service";
import {HttpClient} from "@angular/common/http";

export interface Request {
  id: number
  wasteType: string
  photos: string[]
  weight: number
  address: string
  date: string
  timeSlot: string
  notes?: string
  userId: string;
  status: "En attente" | "Occupée" | "En cours" | "Validée" | "Rejetée"
}

@Component({
  selector: "app-request",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./request.component.html",
})
export class RequestComponent implements OnInit {
  collectionRequests: CollectionRequest[] = [];

  constructor(private http: HttpClient,private collectionService: CollectionService) {
  }

  fetchCollections(): void {
    this.collectionService.getAllDemands().subscribe({
      next: (data) => {
        console.log(data);
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);

        // SweetAlert2 error alert
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de récupérer les compétitions.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }


  ngOnInit() {
    this.fetchCollections();
    this.collectionRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

