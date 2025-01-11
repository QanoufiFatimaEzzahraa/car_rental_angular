import { Component } from '@angular/core'
import { AdminService } from '../../services/admin.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrl: './update-car.component.scss'
})
export class UpdateCarComponent {
  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  isSpinning: boolean = false
  carId: number = this.activatedRoute.snapshot.params['id']
  imgChanged: boolean = false
  selectedFile: any = null
  imagePreview: string | ArrayBuffer | null = null
  existingImage: string | null = null
  updateForm!: FormGroup // Formulaire pour la mise à jour de la voiture
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus']

  ngOnInit() {
    this.updateForm = this.fb.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      year: [null, Validators.required],
      licensePlate: [null, Validators.required],
      pricePerDay: [null, Validators.required],
      description: [null, Validators.required]
    })

    this.getCarById()
  }

  getCarById() {
    this.isSpinning = true

    this.adminService.getCarById(this.carId).subscribe(res => {
      this.isSpinning = false

      const carDto = res
      this.existingImage = `data:image/jpeg;base64,${carDto.returnedImage}`
      this.updateForm.patchValue({
        brand: carDto.brand,
        model: carDto.model,
        year: carDto.year,
        licensePlate: carDto.licensePlate,
        pricePerDay: carDto.pricePerDay,
        description: carDto.description
      })
    })
  }

  updateCar() {
    this.isSpinning = true

    const formData: FormData = new FormData()
    if (this.imgChanged && this.selectedFile) {
      formData.append('image', this.selectedFile as Blob)
    }

    formData.append('brand', this.updateForm.value.brand)
    formData.append('model', this.updateForm.value.model)
    formData.append('year', this.updateForm.value.year)
    formData.append('licensePlate', this.updateForm.value.licensePlate)
    formData.append('pricePerDay', this.updateForm.value.pricePerDay)
    formData.append('description', this.updateForm.value.description)

    this.adminService.updateCar(this.carId, formData).subscribe(
      res => {
        this.message.success('Car updated successfully', { nzDuration: 3000 })
        this.isSpinning = false
        this.router.navigateByUrl('/admin/dashboard')
      },
      error => {
        this.message.error('Error updating car', { nzDuration: 3000 })
        console.log(error)
      }
    )
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
    this.imgChanged = true
    this.existingImage = null
    this.previewImage()
  }

  previewImage() {
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(this.selectedFile)
  }
}
