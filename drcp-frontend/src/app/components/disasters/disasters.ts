import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DisastersService } from '../../services/disasters-service';
import { AuthService } from '../../services/auth-service';
import { ResourcesService } from '../../services/resources-service';
import { MapService } from '../../services/map-service';

@Component({
  selector: 'app-disasters',
  imports: [ReactiveFormsModule, MatIconModule, CommonModule, MatIconModule],
  templateUrl: './disasters.html',
  styleUrl: './disasters.scss',
  standalone: true
})
export class Disasters {

  disasterForm: FormGroup;
  bgImg: string = "https://images.unsplash.com/photo-1716583513282-3e3e17996a63?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


  loggedUserDetails: any = {};
  loggedUserRole: string = "";
  hasAdminOrVolunteerRole: boolean = false;
  roleLoaded: boolean = false;

  openCreteDisasterForm: boolean = false;

  viewDisastersTable: boolean = false;
  disastersList: any[] = [];

  openUpdateDisasterForm: boolean = false;
  updateDisasterForm: FormGroup;
  fillDetails: boolean = false;

  openDeleteDisasterForm: boolean = false;
  deleteDisasterForm: FormGroup;

  openFindResourcesForm: boolean = false;
  findResourcesForm: FormGroup;
  resourcesList: any[] = [];
  viewResourcesTable: boolean = false;

  openWayToResourceForm: boolean = false;
  wayToResourceForm: FormGroup;
  startingPointCoordinates: any[] = [];
  destinationPointCoordinates: any[] = [];
  showMap: boolean = false;
  map: any;
  async initMap(center: [number, number], zoom: number = 5) {
    if (typeof window === 'undefined') return;
    const leaflet = await import('leaflet');
    if (!this.map && document.getElementById('map')) {
      this.map = leaflet.map('map').setView(center, zoom);
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    }
  }

  constructor(private fb: FormBuilder,
    private disastersService: DisastersService,
    private authService: AuthService, private cdr: ChangeDetectorRef,
    private resourcesService: ResourcesService,
    private mapService: MapService) {

    this.disasterForm = this.fb.group({
      title: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      description: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      ownerId: [''],
      createdAt: [''],
      auditTrail: ['']
    });

    this.updateDisasterForm = this.fb.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      description: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      ownerId: [''],
      createdAt: [''],
      auditTrail: ['']
    });

    this.deleteDisasterForm = this.fb.group({
      id: ['', [Validators.required]]
    });

    this.findResourcesForm = this.fb.group({
      disasterId: ['', [Validators.required]]
    });

    this.wayToResourceForm = this.fb.group({
      disasterId: ['', [Validators.required]],
      resourceId: ['', [Validators.required]]
    });

  }

  ngOnInit() {
    this.authService.getLoggedUserDetails().subscribe({
      next: (response) => {
        this.loggedUserDetails = response;
        console.log("logged user details: ", this.loggedUserDetails);
        this.loggedUserRole = this.loggedUserDetails.role;
        console.log("logged user role: ", this.loggedUserRole);
        this.hasAdminOrVolunteerRole = this.loggedUserRole === "ADMIN" || this.loggedUserRole === "VOLUNTEER";
        console.log("hasAdminOrVolunteerRole: ", this.hasAdminOrVolunteerRole);
        this.roleLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.roleLoaded = true;
      }
    });

    this.loadAllDisasters();
  }

  loadAllDisasters() {
    this.disastersService.getAllDisasters().subscribe({
      next: (response) => {
        this.disastersList = response;
        console.log("disasters list: ", this.disastersList);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onClickCreate() {
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = true;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickCloseCreate() {
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickView() {
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = true;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickCloseView() {
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickUpdate() {
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = true;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickDelete() {
    this.openDeleteDisasterForm = true;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickFindResources() {
    this.openFindResourcesForm = true;
    this.viewResourcesTable = false;
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
    this.openWayToResourceForm = false;
    this.showMap = false;
  }

  onClickFetchDisaster() {
    this.fillDetails = true;
    const id = this.updateDisasterForm.get('id')?.value;
    this.disastersService.getDisasterById(id).subscribe({
      next: (response) => {
        this.updateDisasterForm.patchValue(response);
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onClickWayToResource() {
    this.openWayToResourceForm = true;
    this.openFindResourcesForm = false;
    this.viewResourcesTable = false;
    this.openDeleteDisasterForm = false;
    this.openUpdateDisasterForm = false;
    this.viewDisastersTable = false;
    this.openCreteDisasterForm = false;
    this.fillDetails = false;
  }

  onSubmitCreate() {
    const formData = this.disasterForm.value;
    let id = "";

    this.disastersService.createDisaster(formData).subscribe({
      next: (response) => {
        if (!this.disastersList) {
          this.disastersList = [];
        }
        id = response.id;
        this.disastersList.push(response);
        this.disasterForm.reset();
        alert("disaster created successfully with id: " + id + "please refresh the page...");
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.error);
        } else {
          alert('Something went wrong!');
          console.error('Error:', err);
        }
      }
    });
    this.openCreteDisasterForm = false;
    this.loadAllDisasters();
    this.viewDisastersTable = true;
  }

  onSubmitUpdate() {
    const id = this.updateDisasterForm.get('id')?.value;
    const formData = this.updateDisasterForm.value;
    this.disastersService.updateDisasterById(id, formData).subscribe({
      next: (response) => {
        alert("disaster with id: " + id + " updated successfully please refresh the page...");
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.error);
        } else {
          alert('Something went wrong!');
          console.error('Error:', err);
        }
      }
    });
    this.fillDetails = false;
    this.openUpdateDisasterForm = false;
    this.loadAllDisasters();
    this.viewDisastersTable = true;
  }

  onSubmitDelete() {
    const id = this.deleteDisasterForm.get('id')?.value;
    this.disastersService.deleteDisasterById(id).subscribe({
      next: (response) => {
        alert("Disaster with id : " + id + " is deleted sucessfully please refresh the page...");
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.error);
        } else {
          alert('Something went wrong!');
          console.error('Error:', err);
        }
      }
    });
    this.openDeleteDisasterForm = false;
    this.loadAllDisasters();
    this.viewDisastersTable = true;
  }

  onSubmitFindResources() {
    const disasterId = this.findResourcesForm.get('disasterId')?.value;
    this.resourcesService.findAllResourcesByDisasterId(disasterId).subscribe({
      next: (response) => {
        if (!this.resourcesList) {
          this.resourcesList = [];
        }
        this.resourcesList = response;
        this.findResourcesForm.reset();
      },
      error: (err) => {
        if (err.status === 400) {
          alert(err.error.error);
        } else {
          alert('Something went wrong!');
          console.error('Error:', err);
        }
      }
    });
    this.viewResourcesTable = true;
  }

  onSubmitWayToResource() {
    const disasterId = this.wayToResourceForm.get('disasterId')?.value;
    const resourceId = this.wayToResourceForm.get('resourceId')?.value;
    this.disastersService.getCoordinates(disasterId).subscribe({
      next: async (startCoords) => {
        this.startingPointCoordinates = startCoords;
        this.resourcesService.getCoordinates(resourceId).subscribe({
          next: async (destCoords) => {
            this.destinationPointCoordinates = destCoords;
            this.showMap = true;
            const midLat = (startCoords[0] + destCoords[0]) / 2;
            const midLng = (startCoords[1] + destCoords[1]) / 2;
            await this.initMap([midLat, midLng]);
            const leaflet = await import('leaflet');
            const routeCoords = await this.mapService.getRoute(startCoords, destCoords);
            leaflet.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(this.map);
            leaflet.circle(startCoords, { radius: 500, color: 'green', fillColor: 'green', fillOpacity: 0.5 }).addTo(this.map);
            const locationIcon = leaflet.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });
            leaflet.marker(destCoords, { icon: locationIcon }).addTo(this.map);
          },
          error: (err) => { console.log(err); }
        });
      },
      error: (err) => { console.log(err); }
    });

  }
}
