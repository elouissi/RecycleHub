import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"; // Changez type import à regular import
import type { Observable } from "rxjs"

export interface WasteType {
  type: string
  weight: number
}

export interface CollectionRequest {
  id?: number
  address: string
  date: string
  notes: string
  photos: string
  timeSlot: string
  wasteTypes: WasteType[]
  totalWeight: number
  userId: string
  status: string
}

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private apiUrl = "http://localhost:3000/demands"

  constructor(private http: HttpClient) {}

  createDemand(demand: CollectionRequest): Observable<CollectionRequest> {
    return this.http.post<CollectionRequest>(this.apiUrl, demand)
  }

  getAllDemands(): Observable<CollectionRequest[]> {
    return this.http.get<CollectionRequest[]>(this.apiUrl)
  }

  getDemandById(id: number): Observable<CollectionRequest> {
    return this.http.get<CollectionRequest>(`${this.apiUrl}/${id}`)
  }

  updateDemand(id: number, demand: CollectionRequest): Observable<CollectionRequest> {
    return this.http.put<CollectionRequest>(`${this.apiUrl}/${id}`, demand)
  }

  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  calculSommeDesPoids(demands: CollectionRequest[]): number {
    return demands.reduce((somme, demand) => somme + demand.totalWeight, 0)
  }
}

