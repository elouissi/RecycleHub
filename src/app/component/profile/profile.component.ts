import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  birthDate: string;
  password: string;
  profilePicture: string | null;
  montant: number;
  points:number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./profile.component.html",
})
export class ProfileComponent implements OnInit {
  user: User = {
    id: "",
    address: "",
    birthDate: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    profilePicture: null,
    montant:0,
    points:0,
  };

  showPassword: boolean = false;
  userPoints: number = 0;

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  convertPoints(points: number) {

    Swal.fire({
      title: 'Confirmer la conversion',
      text: `Êtes-vous sûr de vouloir convertir ${points} points ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, convertir',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        let voucherAmount = 0;
        switch (points) {
          case 100:
            voucherAmount = 50;
            break;
          case 200:
            voucherAmount = 120;
            break;
          case 500:
            voucherAmount = 350;
            break;
        }
        const updateData = {
          points: this.authService.getPoints() - points,
          montant: this.authService.getMontant() + voucherAmount
        };
        this.http.patch(`${this.apiUrl}/users/${this.user.id}`, updateData).subscribe({
          next: (response: any) => {
            this.user.points = updateData.points;
            this.user.montant = updateData.montant;
            this.userPoints = updateData.points;

            const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            userData.points = updateData.points;
            userData.montant = updateData.montant;
            localStorage.setItem('currentUser', JSON.stringify(userData));

            this.authService.updatePoints(updateData.points,updateData.montant);

            Swal.fire({
              title: 'Succès',
              text: `Vous avez converti ${points} points en ${voucherAmount} Dh.`,
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (error) => {
            console.error('Erreur lors de la conversion des points', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la conversion des points.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadUserProfile(userId);
    });
  }
  loadUserProfile(userId: string) {
    this.http.get<User>(`${this.apiUrl}/users/${userId}`).subscribe({
      next: (data) => {
        this.user = { ...data };
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les données du profil',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  getPoints() : number| null  {
    return this.authService.getPoints();
  }
  getMontant() : number| null  {
    return this.authService.getMontant();
  }
  updateProfile() {
    const updateData = { ...this.user };
    if (updateData.password == "") {
      console.log("entrer contdition")
      updateData.password = this.user.password;
      console.log("updated pass"+ updateData.password+"ancian" + this.user.password);
    }




    this.http.put(`${this.apiUrl}/users/${this.user.id}`, updateData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: 'Profil mis à jour avec succès',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de mettre à jour le profil',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  deleteProfile() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/users/${this.user.id}`).subscribe({
          next: () => {
            this.authService.logout();
            Swal.fire(
              'Supprimé !',
              'Votre profil a été supprimé avec succès.',
              'success'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du profil', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible de supprimer le profil',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }}
