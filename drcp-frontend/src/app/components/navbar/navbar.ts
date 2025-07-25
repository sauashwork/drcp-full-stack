import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: true
})
export class Navbar {

  navItems: { routerLink: string, name: string }[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    
    this.navItems = [
      { routerLink: "", name: "Home" },
      { routerLink: "disasters", name: "Disaster" },
      { routerLink: "resources", name: "Resources" },
      { routerLink: "reports", name: "Reports" },
      { routerLink: "updates", name: "Updates" },
    ];
  }

  isDarkMode: boolean = false;

  onClickThemeToggle() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  onLogout(){
    this.authService.logout();
  }
}
