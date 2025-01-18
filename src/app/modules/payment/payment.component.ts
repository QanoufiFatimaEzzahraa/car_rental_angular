import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';

declare var Stripe: any; // Pour inclure Stripe

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  card: any;
  paymentSuccess: boolean = false;
  paymentError: string = '';
  isProcessing: boolean = false; // État pour éviter les appels multiples

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.initializeStripe();
  }

  initializeStripe() {
    this.stripe = Stripe('pk_test_51Qi13sCkuNPazrmqNHvjv1Q06sIQ6hnHU6YkPazAlNvBXI5aRLkN8Ihi7xUpuyHbM1u4DrM9h4MklOMGi8GXWrb800gWHu9lxA'); // Remplacez par votre clé publique Stripe
    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  pay(amount: number, currency: string) {
    if (this.isProcessing) {
      return; // Empêche les appels multiples si un paiement est déjà en cours
    }

    this.isProcessing = true; // Désactive le bouton pendant le traitement
    this.paymentError = ''; // Réinitialise les erreurs éventuelles

    this.paymentService.createPaymentIntent(amount, currency).subscribe(
      (response) => {
        const clientSecret = response.clientSecret;

        this.stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card,
            },
          })
          .then((result: any) => {
            if (result.error) {
              this.paymentError = result.error.message;
              this.isProcessing = false; // Réactive le bouton si une erreur survient
            } else if (result.paymentIntent.status === 'succeeded') {
              this.paymentSuccess = true;
              this.isProcessing = false; // Réactive le bouton après succès
            }
          })
          .catch((error: any) => {
            console.error('Error confirming card payment:', error);
            this.paymentError = 'Une erreur est survenue lors de la confirmation du paiement.';
            this.isProcessing = false; // Réactive le bouton en cas d'erreur
          });
      },
      (error) => {
        console.error('Error creating payment intent:', error);
        this.paymentError = 'Une erreur est survenue lors de la création de intention de paiement.';
        this.isProcessing = false; // Réactive le bouton en cas d'erreur
      }
    );
  }
}
