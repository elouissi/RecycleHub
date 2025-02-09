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
            tap((registeredUser : any) => {
              this.http.put(`${this.apiUrl}/token/3ede`, { exist: true }).subscribe({
                next: (tokenResponse) => {
                  console.log("Token mis à jour :", tokenResponse);
                },
                error: (error) => {
                  console.error("Erreur lors de la mise à jour du token", error);
                }
              });
              const userData = {
                id: registeredUser.id,
                email: registeredUser.email,
                firstName: registeredUser.firstName,
                lastName: registeredUser.lastName,
                role: registeredUser.role,
                address: registeredUser.address,
                points: registeredUser.points,
              };
              localStorage.setItem("currentUser", JSON.stringify(userData));
              console.log("hhhhhh" + localStorage.getItem("currentUser"));

              this.currentUserSubject.next(userData);
            })
          );
        }
      }),
      catchError((error) => {
        console.error(error.message);
        return throwError(() => error);
      })
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`).pipe(
      tap((users) => {
        if (users.length > 0) {
          const userData = {
            id: users[0].id,
            email: users[0].email,
            firstName: users[0].firstName,
            lastName: users[0].lastName,
            role: users[0].role,
            address: users[0].address,
            points: users[0].points,
          };
          localStorage.setItem("currentUser", JSON.stringify(userData))
          this.currentUserSubject.next(userData)
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
  getUserId(): string | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.id || null;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'id :", error);
        return null;
      }
    }
    return null;
  }
  getRole(): string | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.role || null;
      } catch (error) {
        console.error("Erreur lors de la récupération du role :", error);
        return null;
      }
    }
    return null;
  }
  getAddress(): string | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.address || null;
      } catch (error) {
        console.error("Erreur lors de la récupération d'adress :", error);
        return null;
      }
    }
    return null;
  }
  getPoints(): number | null {
    const user = localStorage.getItem("currentUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.points !== undefined ? parsedUser.points : null;
      } catch (error) {
        console.error("Erreur lors de la récupération des points :", error);
        return null;
      }
    }
    return null;
  }










}

