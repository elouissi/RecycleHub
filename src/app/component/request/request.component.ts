import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import { CollectionRequest, CollectionService } from "../../services/collection/collection.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-request",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./request.component.html",
})
export class RequestComponent implements OnInit {
  collectionRequests: CollectionRequest[] = [];

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService
  ) {}

  // Récupérer toutes les demandes
  fetchCollections(): void {
    this.collectionService.getAllDemands().subscribe({
      next: (data) => {
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error("Error fetching collections:", err);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les demandes.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  }

  // Récupérer les demandes par adresse
  fetchAdressCollections(address: string | null): void {
    this.collectionService.getAdressDemands(address).subscribe({
      next: (data) => {
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error("Error fetching collections:", err);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les demandes.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  }

  // Récupérer les demandes d'un utilisateur
  fetchUserCollections(id: string | null): void {
    this.collectionService.getUserDemands(id).subscribe({
      next: (data) => {
        this.collectionRequests = data;
      },
      error: (err) => {
        console.error("Error fetching collections:", err);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les demandes.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  }


  updateRequestStatus(request: CollectionRequest, newStatus: string): void {
    const updatedRequest = { ...request, status: newStatus };

    this.collectionService.updateDemand(request.id!, updatedRequest).subscribe({
      next: () => {
        if (newStatus === "Validée") {
          const pointsToAdd = this.collectionService.calculatePoints(request.wasteTypes);
          this.collectionService.updateUserPoints(request.userId, pointsToAdd).subscribe({
            next: () => {
              Swal.fire({
                title: "Succès",
                text: `Statut de la demande mis à jour avec succès et ${pointsToAdd} points ajoutés à l'utilisateur.`,
                icon: "success",
                confirmButtonText: "OK",
              });
            },
            error: (err) => {
              console.error("Error updating user points:", err);
              Swal.fire({
                title: "Erreur",
                text: "Impossible de mettre à jour les points de l'utilisateur",
                icon: "error",
                confirmButtonText: "OK",
              });
            },
          });
        } else {
          Swal.fire({
            title: "Succès",
            text: "Statut de la demande mis à jour avec succès",
            icon: "success",
            confirmButtonText: "OK",
          });
        }

        this.refreshCollections();
      },
      error: (err) => {
        console.error("Error updating request:", err);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de mettre à jour le statut de la demande",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });
  }
  deleteRequest(request: CollectionRequest): void {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action ne peut pas être annulée!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.collectionService.deleteDemand(request.id!).subscribe({
          next: () => {
            Swal.fire("Supprimé!", "La demande a été supprimée.", "success");
            this.refreshCollections();
          },
          error: (err) => {
            console.error("Error deleting request:", err);
            Swal.fire({
              title: "Erreur",
              text: "Impossible de supprimer la demande",
              icon: "error",
              confirmButtonText: "OK",
            });
          },
        });
      }
    });
  }

  private refreshCollections(): void {
    if (this.authService.getRole() === "collecteur") {
      this.fetchAdressCollections(this.authService.getAddress());
    } else if (this.authService.getRole() === "particulier") {
      this.fetchUserCollections(this.authService.getUserId());
    } else {
      this.fetchCollections();
    }
  }

  ngOnInit(): void {
    this.refreshCollections();
  }

  getRole() {
    return this.authService.getRole();


  }
}
