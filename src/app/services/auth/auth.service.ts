import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from "rxjs";
import Swal from "sweetalert2";
import {User} from "../collection/collection.service";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  address: string;
  points: number;
  montant?: number;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000";
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor(private http: HttpClient) {
    let initialUser: UserData | null = null;
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        initialUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Erreur lors du parsing des données utilisateur:", error);
      localStorage.removeItem("currentUser");
    }

    this.currentUserSubject = new BehaviorSubject<UserData | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${user.email}`).pipe(
      switchMap((existingUsers: any) => {
        if (existingUsers && existingUsers.length > 0) {
          Swal.fire({
            title: 'Erreur',
            text: 'L\'email est déjà utilisé. Veuillez en choisir un autre.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return throwError(() => new Error('Email déjà utilisé.'));
        }

        // Nettoyage des données avant l'envoi
        const userToRegister = { ...user };
        if (userToRegister.profilePicture === null) {
          delete userToRegister.profilePicture;
        }
        userToRegister.points = userToRegister.points || 0;
        userToRegister.montant = userToRegister.montant || 0;

        return this.http.post(`${this.apiUrl}/users`, userToRegister).pipe(
          tap((registeredUser: any) => {
            // Mise à jour du token
            this.updateToken(true);

            // Préparation des données utilisateur
            const userData: UserData = {
              id: registeredUser.id,
              email: registeredUser.email,
              firstName: registeredUser.firstName,
              lastName: registeredUser.lastName,
              role: registeredUser.role,
              address: registeredUser.address,
              points: registeredUser.points,
              montant: registeredUser.montant
            };

            this.saveUserData(userData);
          })
        );
      }),
      catchError((error) => {
        console.error("Erreur lors de l'inscription:", error);
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      tap((users) => {
        if (users.length > 0) {
          const userData: UserData = {
            id: users[0].id,
            email: users[0].email,
            firstName: users[0].firstName,
            lastName: users[0].lastName,
            role: users[0].role,
            address: users[0].address,
            points: users[0].points || 0,
            montant: users[0].montant || 0
          };
          this.saveUserData(userData);
        }
      }),
      catchError((error) => {
        console.error("Erreur lors de la connexion:", error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.updateToken(false);
  }

  getUserEmail(): string | null {
    return this.currentUserValue?.email || null;
  }

  getUserFirst(): string | null {
    return this.currentUserValue?.firstName || null;
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${this.currentUserValue?.id}`);
  }

  updateUser(user: User): Observable< User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  getUserId(): string | null {
    return this.currentUserValue?.id || null;
  }

  getRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  getAddress(): string | null {
    return this.currentUserValue?.address || null;
  }

  getPoints(): number {
    return this.currentUserValue?.points || 0;
  }
  getMontant(): number {
    return this.currentUserValue?.montant || 0;
  }
  updatePoints(points: number,montant: number) {
    if (this.currentUserValue) {
      const updatedUser = {
        ...this.currentUserValue,
        points: points,
        montant: montant
      };
      this.saveUserData(updatedUser);
    }
  }

  private saveUserData(userData: UserData) {
    try {
      localStorage.setItem("currentUser", JSON.stringify(userData));
      this.currentUserSubject.next(userData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données utilisateur:", error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la sauvegarde des données.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  private updateToken(exists: boolean) {
    this.http.put(`${this.apiUrl}/token/3ede`, { exist: exists }).subscribe({
      next: () => console.log("Token mis à jour"),
      error: (error) => console.error("Erreur lors de la mise à jour du token:", error)
    });
  }
}
