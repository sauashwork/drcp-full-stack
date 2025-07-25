import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true
})
export class Home {

  username: string = "";
  expireTime: string = localStorage.getItem('expiration-time') || "";

  constructor(private router: Router, private authService: AuthService) {
    this.username = this.authService.getUser();
    console.log(this.username);
  }

  ngOnInit(): void {
    this.authService.getExpirationTime().subscribe({
      next: (response) => {
        const expirationTime = new Date(response);
        const expirationTimeInLocalDate = expirationTime.toLocaleString();
        console.log("expirationTimeInLocalDate", expirationTimeInLocalDate);
        this.expireTime = expirationTimeInLocalDate;
        console.log('expireTime updated:', this.expireTime);
        localStorage.setItem('expiration-time', JSON.stringify(expirationTime));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  homeItems: { img: string; heading: string; description: string, routerLink: string }[] = [
    {
      img: "https://images.unsplash.com/photo-1581059686229-de26e6ae5dc4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGlzYXN0ZXJ8ZW58MHx8MHx8fDA%3D",
      heading: "Disaster",
      description:
        "Capture and manage detailed disaster data with full support for CRUD operations. Each disaster entry includes a title, descriptive information, location (extracted using the Gemini AI model), tags (e.g., flood, earthquake), and audit trails to maintain history and accountability. Using geocoding services like Google Maps, Mapbox, or OpenStreetMap, the platform transforms descriptive locations into precise coordinates for mapping and geospatial queries. Disasters can be tracked in real time with integrated alerts and WebSocket-based live updates.",
      routerLink: 'disasters'
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1722054521432-602eba4605cc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzY3VlJTIwc2hlbHRlcnxlbnwwfHwwfHx8MA%3D%3D",
      heading: "Resources",
      description:
        "Rescue resources such as shelters, hospitals, food centers, and emergency services. Using Supabase’s powerful geospatial indexing and geocoding, users can instantly locate resources within a disaster zone or nearby affected areas. The system supports efficient lookups using ST_DWithin and displays real-time updates on resource availability. Each resource is categorized (shelter, medical, food, etc.) and associated with its own location metadata, which can be visualized on a map and queried by type and proximity to disaster coordinates.",
      routerLink: 'resources'
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1661431121792-81fa2b971d0f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmVwb3J0c3xlbnwwfHwwfHx8MA%3D%3D",
      heading: "Reports",
      description:
        "Leverage real-time crowdsourced information and social media feeds to understand ground-level conditions. The platform integrates a mock Twitter API or alternatives (e.g., Bluesky) to fetch social media posts tagged with disaster-related keywords. Reports can include user-submitted content such as photos, alerts, or resource needs. Each report can be verified using Gemini AI’s image analysis for authenticity checks, and flagged for urgency based on keyword analysis (e.g., 'urgent', 'SOS'). These insights help authorities and volunteers prioritize responses effectively.",
      routerLink: 'reports'
    },
    {
      img: "https://plus.unsplash.com/premium_photo-1688561383440-feef3fee567d?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z292ZXJuYW1lbnQlMjB1cGRhdGVzfGVufDB8fDB8fHww",
      heading: "Official Updates",
      description:
        "Stay informed with verified updates directly sourced from government bodies and official relief organizations such as FEMA, Red Cross, and local authorities. The system scrapes and fetches data through the Browse Page using Node.js scraping tools like Cheerio, presenting up-to-date announcements, safety protocols, and emergency contact information. These updates are cached in Supabase with a TTL strategy to ensure both real-time freshness and efficiency. This feature ensures that responders and the public have a single trusted feed for ongoing relief and recovery efforts.",
      routerLink: 'updates'
    }
  ];

  handleOnClickItem(item: any): void {
    console.log(item.routerLink);
    this.router.navigateByUrl(`${item.routerLink}`);;
  }
}
