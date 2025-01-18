import { Component } from '@angular/core'
import { StorageService } from './auth/components/services/storage/storage.service'
import { Router, NavigationEnd  } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'car-rental-angular'
  isOnSignup = false;
  isOnLogin = false;
  isCustomerLoggedIn: boolean = StorageService.isCustomerLoggedIn()
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn()

  popularCars = [
    {
      name: 'Tesla Model 3',
      price: 100,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'BMW 5 Series',
      price: 85,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Mercedes C-Class',
      price: 90,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80'
    }
  ];



  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event.constructor.name === 'NavigationEnd') {
        this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn()
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn()
      }
      if (event instanceof NavigationEnd) {
        this.isOnSignup = event.url === '/register';
        this.isOnLogin = event.url === '/login';
      }
    })
  }

  logout() {
    StorageService.logout()
    this.router.navigateByUrl('/login')
  }
}
