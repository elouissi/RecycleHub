import { HttpClient } from "@angular/common/http"; // Changez type import à regular import
import { Injectable } from "@angular/core"
import {BehaviorSubject, catchError, Observable, switchMap, tap, throwError} from "rxjs"
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:3000"
  private currentUserSubject: BehaviorSubject<any>
  public currentUser: Observable<any>

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("currentUser") || "null"))
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue() {
    return this.currentUserSubject.value
  }
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value ;
  }



  register(user: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users?email=${user.email}`).pipe(
      switchMap((existingUser: any) => {
        if (existingUser && existingUser.length > 0) {
          Swal.fire({
            title: 'Erreur',
            text: 'L\'email est déjà utilisé. Veuillez en choisir un autre.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return throwError(() => new Error('Email déjà utilisé.'));
        } else {
          if (user.profilePicture === null) {
            delete user.profilePicture;
          }
          return this.http.post(`${this.apiUrl}/users`, user).pipe(
            tap((registeredUser) => {
              this.http.put(`${this.apiUrl}/token/3ede`, { exist: true }).subscribe({
                next: (tokenResponse) => {
                  console.log("Token mis à jour :", tokenResponse);
                },
                error: (error) => {
                  console.error("Erreur lors de la mise à jour du token", error);
                }
              });
              const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
              };
              console.log("Utilisateur enregistré :", userData);
              localStorage.setItem("currentUser", JSON.stringify(userData));
              console.log("hhhhhh" + localStorage.getItem("currentUser"));

              this.currentUserSubject.next(userData);
            })
          );
        }
      }),
      catchError((error) => {
        console.error(error.message);
        // Vous pouvez également renvoyer l'erreur au composant pour l'afficher
        return throwError(() => error);
      })
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      tap((users) => {
        if (users.length > 0) {
          localStorage.setItem("currentUser", JSON.stringify(users[0]))
          this.currentUserSubject.next(users[0])
        }
      }),
    )
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);

    return this.http.put(`${this.apiUrl}/token/3ede`, { exist: false }).subscribe({
      next: (tokenResponse) => {
        console.log("Token mis à jour :", tokenResponse);
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour du token", error);
      }
    });
  }
  getUserEmail(): string | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.email || null;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'email :", error);
        return null;
      }
    }
    return null;
  }
  getUserFirst(): string | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.firstName || null;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'email :", error);
        return null;
      }
    }
    return null;
  }




}

