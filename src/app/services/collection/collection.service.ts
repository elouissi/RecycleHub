import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable, switchMap} from "rxjs";

export interface WasteType {
  type: string;
  weight: number; // en grammes
}

export interface CollectionRequest {
  id?: number;
  address: string;
  date: string;
  notes: string;
  photos: string;
  timeSlot: string;
  wasteTypes: WasteType[];
  totalWeight: number;
  userId: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  address: string;
  points: number;
  montant: number;
  birthDate: string;
  password: string;
  phone: string;
  profilePicture: string | null;
}

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = "http://localhost:3000/demands";
  private userApiUrl = "http://localhost:3000/users";

  constructor(private http: HttpClient) {}

  // Récupérer toutes les demandes
  getAllDemands(): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(this.apiUrl);
  }

  // Récupérer les demandes par adresse
  getAdressDemands(address: string | null): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(`${this.apiUrl}?address=${address}`);
  }

  // Récupérer les demandes d'un utilisateur
  getUserDemands(id: string | null): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(`${this.apiUrl}?userId=${id}`);
  }

  // Récupérer les demandes en attente pour un utilisateur
  getPendingDemands(userId: string | null): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(`${this.apiUrl}?status=En%20cours&userId=${userId}`);
  }

  // Récupérer une demande par son ID
  getDemandById(id: number): Observable<CollectionRequest> {
    return this.http.get<CollectionRequest>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle demande
  createDemand(demand: CollectionRequest): Observable<CollectionRequest> {
    return this.http.post<CollectionRequest>(this.apiUrl, demand);
  }

  // Mettre à jour une demande
  updateDemand(id: number, demand: CollectionRequest): Observable<CollectionRequest> {
    return this.http.put<CollectionRequest>(`${this.apiUrl}/${id}`, demand);
  }

  // Supprimer une demande
  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/${userId}`);
  }
  calculatePoints(wasteTypes: WasteType[]): number {
    let totalPoints = 0;
    console.log("wase"+wasteTypes.length);
    wasteTypes.forEach((waste) => {
      const weightInKg = waste.weight / 1000;
      switch (waste.type) {
        case "plastique":
          totalPoints = totalPoints + weightInKg * 2;
          break;
        case "verre":
          totalPoints =totalPoints +  weightInKg * 1;
          break;
        case "papier":
          totalPoints =totalPoints +  weightInKg * 1;
          break;
        case "metal":
          totalPoints =totalPoints +  weightInKg * 5;
          break;
        default:
          break;
      }
    });
    return totalPoints;
  }

  updateUserPoints(userId: string, points: number): Observable<User> {
    return this.getUser(userId).pipe(
      switchMap((user) => {
        const updatedUser = {
          ...user,
          points: user.points + points,
        };
        return this.http.put<User>(`${this.userApiUrl}/${userId}`, updatedUser);
      })
    );
  }
}
