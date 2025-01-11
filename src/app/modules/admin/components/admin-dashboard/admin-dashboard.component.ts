import { Component } from '@angular/core'
import { AdminService } from '../../services/admin.service'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  cars: any[] = []

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getAllCars()
  }

  getAllCars() {
    this.adminService.getAllCars().subscribe(res => {
      res.forEach((car: any) => {
        // Processing the image to display it
        car.processedImage = `data:image/jpeg;base64,${car.returnedImage}`
        this.cars.push(car)
      })
    })
  }

  deleteCar(id: number) {
    this.adminService.deleteCar(id).subscribe(res => {
      // Removing the deleted car from the array
      this.cars = this.cars.filter(car => car.id !== id)

      // Display success message
      this.message.success('Car deleted successfully', { nzDuration: 3000 })
    })
  }
}
