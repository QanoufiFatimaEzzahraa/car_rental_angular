import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service'



declare var Stripe: any; // Pour inclure Stripe


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  bookingDetails: any;
  bookingId: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private customerService:CustomerService,
    private router: Router
  ) {}


    // Récupérer le bookingId depuis les paramètres de l'URL
    ngOnInit(): void {
      // Récupérer les paramètres de la requête (queryParams)
      this.activeRoute.queryParams.subscribe((params) => {
        this.bookingDetails = params;
        //console.log(this.bookingDetails);
        this.bookingId = this.bookingDetails.id;
        console.log(this.bookingId) ;// Utilisation de la syntaxe d'indexation
      });
    }

  processPayment() {
    const paymentData = {
      bookingId: this.bookingId,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvv: this.cvv
    };

    // Appeler le service pour effectuer le paiement
    this.paymentService.processPayment(this.bookingId).subscribe(

      (response) => {
        this.successMessage = "Paiement réussi !";
        this.errorMessage = '';
        this.router.navigate(['/success']); // Rediriger après le paiement réussi
      },
      (error) => {
        this.errorMessage = "Échec du paiement.";
        this.successMessage = '';
      }

    );
    console.log(this.bookingId);
  }
}
