import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.scss']
})
export class PostCarComponent {
  postCarForm!: FormGroup;
  isSpinning: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  listOfBrands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Lexus'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.postCarForm = this.fb.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      year: [null, [Validators.required, Validators.min(1886)]],
      licensePlate: [null, Validators.required],
      pricePerDay: [null, [Validators.required, Validators.min(0)]],
      description: [null, Validators.required]
    });
  }

  postCar() {
    this.isSpinning = true;

    const formData: FormData = new FormData();
    formData.append('image', this.selectedFile as Blob);
    formData.append('brand', this.postCarForm.value.brand);
    formData.append('model', this.postCarForm.value.model);
    formData.append('year', this.postCarForm.value.year);
    formData.append('licensePlate', this.postCarForm.value.licensePlate);
    formData.append('pricePerDay', this.postCarForm.value.pricePerDay);
    formData.append('description', this.postCarForm.value.description);

    this.adminService.postCar(formData).subscribe(
      res => {
        this.message.success('Car posted successfully', { nzDuration: 3000 });
        this.isSpinning = false;
        this.router.navigateByUrl('/admin/dashboard');
      },
      error => {
        this.message.error('Error posting car', { nzDuration: 3000 });
        console.error(error);
      }
    );
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];

    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile as Blob);
  }
}
