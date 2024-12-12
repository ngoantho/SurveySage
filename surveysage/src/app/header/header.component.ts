import { Component, inject } from '@angular/core';
import { AuthproxyService } from '../authproxy.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authProxy: AuthproxyService = inject(AuthproxyService);
  isDropdownVisible = false;

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
