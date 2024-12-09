import { Component } from '@angular/core';
import { AuthproxyService } from './authproxy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'surveysage';

  constructor(proxy: AuthproxyService) {
    proxy.getAuthStatus().subscribe(async status => {
      if (status) {
        proxy.userEmail = await proxy.getUserEmail()
        proxy.userId = Number(await proxy.getUserId())
        proxy.displayName = await proxy.getDisplayName()
        proxy.loggedIn = true;

        console.log('logged in', {
          email: proxy.userEmail,
          id: proxy.userId,
          "display name": proxy.displayName
        })
      } else {
        proxy.loggedIn = false;
        console.log('not logged in')
      }
    })
  }
}
