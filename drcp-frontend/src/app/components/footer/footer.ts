import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true
})
export class Footer {

  currentYear: number=new Date().getFullYear();
  
  footerItems:{routerLink:string, name: string}[]=[
    {routerLink: "disasters", name: "Disaster"},
    {routerLink: "resources", name: "Resources"},
    {routerLink: "reports", name: "Reports"},
    {routerLink: "updates", name: "Updates"}
  ];
}
