import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import Swal from "sweetalert2";
import {CollectionRequest, CollectionService} from "../../services/collection/collection.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth/auth.service";

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

  constructor(private http: HttpClient,private collectionService: CollectionService,private authService:AuthService) {
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
  fetchAdressCollections(address:string | null ): void {
    this.collectionService.getAdressDemands(address).subscribe({
      next: (data) => {
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de récupérer les compétitions.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });



  }
  fetchUserCollections(id:string | null ): void {
    this.collectionService.getUserDemands(id).subscribe({
      next: (data) => {
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error('Error fetching collections:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de récupérer les compétitions.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });



  }
  updateRequestStatus(request: CollectionRequest, newStatus: string): void {
    const updatedRequest = { ...request, status: newStatus };
    this.collectionService.updateDemand(request.id!, updatedRequest).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès',
          text: 'Statut de la demande mis à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.refreshCollections();
      },
      error: (err) => {
        console.error('Error updating request:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de mettre à jour le statut de la demande',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  getRole(){
    return this.authService.getRole()
  }

  deleteRequest(request: CollectionRequest): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action ne peut pas être annulée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.collectionService.deleteDemand(request.id!).subscribe({
          next: () => {
            Swal.fire(
              'Supprimé!',
              'La demande a été supprimée.',
              'success'
            );
            this.refreshCollections();
          },
          error: (err) => {
            console.error('Error deleting request:', err);
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de supprimer la demande',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  private refreshCollections(): void {
    if (this.authService.getRole() === "collecteur") {
      this.fetchAdressCollections(this.authService.getAdress());
    } else if (this.authService.getRole() === "particulier") {
      this.fetchUserCollections(this.authService.getUserId());
    } else {
      this.fetchCollections();
    }
  }



  ngOnInit() {
    if (this.authService.getRole()=="collecteur"){
      this.fetchAdressCollections(this.authService.getAdress())
    }else if (this.authService.getRole()=="particulier"){

       this.fetchUserCollections(this.authService.getUserId())
    }else {
      alert("all")

      this.fetchCollections();
    }
    this.collectionRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

