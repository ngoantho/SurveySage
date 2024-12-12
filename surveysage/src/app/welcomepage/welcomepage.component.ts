import { Component, inject } from '@angular/core';
import { AuthproxyService } from '../authproxy.service';

@Component({
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrl: './welcomepage.component.css'
})
export class WelcomePageComponent {
  authProxy: AuthproxyService = inject(AuthproxyService)
}
