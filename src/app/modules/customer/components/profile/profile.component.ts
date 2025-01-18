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
  firstName: string = ''; // Remplacez par une donnée dynamique ou par un service utilisateur
  lastName: string = '';  // Remplacez par une donnée dynamique ou par un service utilisateur
  welcomeMessage: string;

  profileForm!: FormGroup; // Formulaire réactif
  isLoading: boolean = false;
  userEmail: string = '';
  avatar: string = '';// Email de l'utilisateur (récupéré automatiquement de l'authentification)

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private message: NzMessageService
  ) {
    this.welcomeMessage = `Bienvenue ${this.firstName} ${this.lastName}! Nous sommes ravis de vous voir.`;

  }

  ngOnInit(): void {
    // Initialisation du formulaire réactif
    this.profileForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

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
        // Créer l'avatar à partir du prénom et du nom
        this.generateAvatar(res.firstName, res.email);
      },
      error => {
        this.isLoading = false;
        console.error('Erreur lors de la récupération du profil :', error);  // Log des erreurs
        this.message.error('Erreur de récupération du profil');
      }
    );
  }

// Fonction pour générer un avatar avec des initiales et une couleur verte
generateAvatar(firstName: string, lastName: string): void {
  const initials = (firstName[0] + lastName[0]).toUpperCase();

  // Couleurs vertes adaptées à un design vert
  const greenColors = ['#32CD32', '#228B22', '#66CDAA', '#2E8B57', '#3CB371'];

  // Calculer une couleur à partir des initiales
  const sum = initials.charCodeAt(0) + initials.charCodeAt(1); // Somme des codes ASCII des lettres
  const avatarColor = greenColors[sum % greenColors.length]; // Choisir une couleur verte parmi la palette

  this.avatar = `https://ui-avatars.com/api/?name=${initials}&background=${avatarColor.replace('#', '')}&color=fff&size=128`;
}


  // Fonction pour générer une couleur d'avatar aléatoire
  getAvatarColor(initials: string): string {
    const colors = ['ff6347', '4682b4', '32cd32', 'ff1493', 'ff6347', 'ff8c00'];
    let sum = 0;
    for (let i = 0; i < initials.length; i++) {
      sum += initials.charCodeAt(i);
    }
    return colors[sum % colors.length]; // Choisir une couleur en fonction des initiales
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatar = e.target.result; // Utiliser la donnée image base64 comme avatar
      };
      reader.readAsDataURL(file);
    }
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
