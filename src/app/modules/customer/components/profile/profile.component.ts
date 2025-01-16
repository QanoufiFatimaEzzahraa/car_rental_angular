import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup; // Formulaire réactif
  isLoading: boolean = false;
  userEmail: string = ''; // Email de l'utilisateur (récupéré automatiquement de l'authentification)

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire réactif
    this.profileForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [{value: null, disabled: true}, [Validators.required, Validators.email]],  // email désactivé
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required]
    });

    // Charger le profil utilisateur
    this.getUserProfile();
  }

  // Fonction pour charger le profil utilisateur depuis le backend
  getUserProfile(): void {
    this.isLoading = true;
    this.profileService.getUserProfile().subscribe(
      (res: any) => {
        this.isLoading = false;
        // Remplir le formulaire avec les données récupérées
        console.log('Profil récupéré :', res);  // Log des données reçues
        this.profileForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          phoneNumber: res.phoneNumber,
          address: res.address
        });
      },
      error => {
        this.isLoading = false;
        console.error('Erreur lors de la récupération du profil :', error);  // Log des erreurs
        this.message.error('Erreur de récupération du profil');
      }
    );
  }


  // Fonction pour mettre à jour le profil de l'utilisateur
  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.message.error('Veuillez remplir tous les champs.');
      return;
    }

    this.isLoading = true;
    const updatedProfile = this.profileForm.value;

    // Envoi des données mises à jour au backend
    this.profileService.updateUserProfile(updatedProfile).subscribe(
      (res) => {
        this.isLoading = false;
        this.message.success('Profil mis à jour avec succès');
      },
      error => {
        this.isLoading = false;
        this.message.error('Erreur lors de la mise à jour du profil');
      }
    );
  }
}
