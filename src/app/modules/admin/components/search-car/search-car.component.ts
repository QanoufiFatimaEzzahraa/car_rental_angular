import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.scss']
})
export class SearchCarComponent {
  searchCarForm!: FormGroup;
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus'];  // Liste exemple de marques
  listOfModels: number[] = [2001]; // Liste des modèles dynamiquement remplie en fonction de la marque sélectionnée
  listOfPricePerDay = [1000, 2000, 3000, 4000, 5000];  // Liste exemple des prix par jour
  isSpinning = false;
  cars: any[] = [];
  message: string = '';  // Message à afficher si aucune voiture n'est trouvée

  constructor(
    private fb: FormBuilder,
    private service: AdminService
  ) {
    this.searchCarForm = this.fb.group({
      brand: [null],
      model: [null],
      pricePerDay: [null],
    });
  }

  // Fonction pour chercher les voitures selon les critères
  searchCar() {
    this.isSpinning = true;  // Affiche l'indicateur de chargement
    this.message = ''; // Réinitialiser le message à chaque recherche

    // Appel au service pour rechercher les voitures
    this.service.searchCar(this.searchCarForm.value).subscribe(
      res => {
        // Vérifier si la réponse est un tableau de voitures
        if (Array.isArray(res.listCarDto) && res.listCarDto.length > 0) {
          // Si des voitures sont trouvées
          this.cars = res.listCarDto.map((car: any) => {
            // Traiter les images des voitures
            car.processedImage = `data:image/jpeg;base64,${car.returnedImage}`;
            return car;
          });
        } else {
          // Si aucune voiture n'est trouvée
          this.cars = [];
          this.message = 'Aucune voiture ne correspond à ces critères.';
        }
        this.isSpinning = false;  // Masque l'indicateur de chargement
        console.log(res);  // Affiche la réponse pour déboguer
      },
      err => {
        // En cas d'erreur
        this.isSpinning = false;
        console.error('Erreur lors de la récupération des données des voitures', err);
        this.message = 'Erreur lors de la recherche des voitures. Veuillez réessayer.';
      }
    );
  }

  // Fonction pour mettre à jour la liste des modèles en fonction de la marque sélectionnée
  updateModels() {
    const selectedBrand = this.searchCarForm.get('brand')?.value;

    // Exemple de logique pour peupler les modèles en fonction de la marque sélectionnée
    if (selectedBrand === 'Toyota') {
      this.listOfModels = [2001, 2002, 2003];  // Modèles Toyota
    } else if (selectedBrand === 'Honda') {
      this.listOfModels = [2010, 2011, 2012];  // Modèles Honda
    } else if (selectedBrand === 'BMW') {
      this.listOfModels = [2015, 2016, 2017];  // Modèles BMW
    } else {
      this.listOfModels = [];  // Si aucune marque n'est sélectionnée, vide
    }
  }
}
