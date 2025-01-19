import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CustomerService } from '../../services/customer.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StorageService } from '../../../../auth/components/services/storage/storage.service'
import { NzMessageService } from 'ng-zorro-antd/message'

const DATE_FORMAT = 'MM-DD-YYYY'

@Component({
  selector: 'app-book-car',
  templateUrl: './book-car.component.html',
  styleUrls: ['./book-car.component.scss']
})
export class BookCarComponent {
  constructor(
    private service: CustomerService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  carId: number = this.activeRoute.snapshot.params['id']
  car: any
  validateForm!: FormGroup
  isSpinning: boolean = false
  today: string = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
  numberOfDays: number = 0

  bookingDetails: any;

  ngOnInit() {
    this.validateForm = this.fb.group({
      toDate: [null, Validators.required],
      fromDate: [null, Validators.required]
    })

    // Listen for changes to the date fields
    this.validateForm.get('fromDate')?.valueChanges.subscribe(() => {
      this.onDateChange()
    })

    this.validateForm.get('toDate')?.valueChanges.subscribe(() => {
      this.onDateChange()
    })

    this.getCarById()
  }


  bookACar(data: any) {
    this.isSpinning = true;

    let bookACarDto = {
      fromDate: data.fromDate,
      toDate: data.toDate,
      userId: StorageService.getUserId(),
      carId: this.carId,
      days: this.numberOfDays
    };
    this.service.bookACar(bookACarDto).subscribe(
      (res) => {
        this.isSpinning = false;
        this.message.success('Car booked successfully');

        // Mise à jour de bookingDetails
      this.bookingDetails = {
        carName: this.car.brand + ' - ' + this.car.model,
        fromDate: data.fromDate,
        toDate: data.toDate,
        days: this.numberOfDays,
        pricePerDay: this.car.pricePerDay,
        price: this.car.pricePerDay * this.numberOfDays,
        id: res.id
      };

      },
      (error) => {
        this.isSpinning = false;
        this.message.error('Error occurred while booking the car');
      }
    );
  }


  initiatePayment(bookingDetails: any) {
    const paymentDetails = {
      amount: bookingDetails.price,
      days: bookingDetails.days,
      pricePerDay: bookingDetails.pricePerDay,
      bookingId: bookingDetails.id
    };

    // Passe les détails de la réservation vers la page de paiement
    this.router.navigate(['/payment'], { queryParams: bookingDetails });
  }



  // Method to calculate the number of days between fromDate and toDate
  onDateChange() {
    const fromDate = this.validateForm.get('fromDate')?.value;
    const toDate = this.validateForm.get('toDate')?.value;

    if (fromDate && toDate) {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const difference = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
      this.numberOfDays = Math.max(difference, 0); // Avoid negative days
    } else {
      this.numberOfDays = 0;
    }
  }

  private getCarById() {
    this.service.getCarById(this.carId).subscribe(res => {
      this.car = res
      this.car.processedImage = `data:image/jpeg;base64,${res.returnedImage}`
    })
  }
}
