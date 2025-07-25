import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ResourcesService } from '../../services/resources-service';
import { AuthService } from '../../services/auth-service';
import { DisastersService } from '../../services/disasters-service';
import { MapService } from '../../services/map-service';

@Component({
  selector: 'app-resources',
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
  standalone: true
})
export class Resources {

  resourceForm: FormGroup;
  bgImg: string = "https://images.unsplash.com/photo-1479244209311-71e35c910f59?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


  loggedUserDetails : any={};
  loggedUserRole: string="";
  hasAdminOrVolunteerRole: boolean=false;
  roleLoaded: boolean=false;

  openCreateResourceForm: boolean = false;

  viewResourcesTable: boolean = false;
  resourcesList: any[] = [];

  openUpdateResourceForm: boolean = false;
  updateResourceForm: FormGroup;
  fillDetails: boolean = false;

  openDeleteResourceForm: boolean = false;
  deleteResourceForm: FormGroup;

  wayToDisasterForm: FormGroup;
  openWayToDisasterForm: boolean=false;
  startingPointCoordinates:any[]=[];
  destinationPointCoordinates:any[]=[];
  showMap:boolean=false;
  map: any;
  async initMap(center: [number, number], zoom: number=5){
    if(typeof window ==='undefined') return;
    const leaflet=await import('leaflet');
    if(!this.map && document.getElementById('map')){
      this.map=leaflet.map('map').setView(center, zoom);
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);
    }
  }

  constructor(private fb: FormBuilder,
     private resourcesService : ResourcesService, 
     private authService : AuthService, 
     private cdr : ChangeDetectorRef, 
     private disastersService: DisastersService,
    private mapService : MapService) {

    this.resourceForm = this.fb.group({
      disasterId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      type: ['', [Validators.required]],
      ownerId: [''],
      auditTrail: ['']
    });

    this.updateResourceForm = this.fb.group({
      id:['', [Validators.required]],
      disasterId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      latitude: [''],
      longitude: [''],
      type: ['', [Validators.required]],
      ownerId: [''],
      auditTrail: ['']
    });

    this.deleteResourceForm = this.fb.group({
      id: ['', [Validators.required]]
    });

    this.wayToDisasterForm=this.fb.group({
      resourceId: ['', [Validators.required]],
      disasterId: ['', [Validators.required]]
    });

  }

  ngOnInit(){
    this.authService.getLoggedUserDetails().subscribe({
      next: (response)=>{
        this.loggedUserDetails=response;
        console.log("logged user details: ", this.loggedUserDetails);
        this.loggedUserRole=this.loggedUserDetails.role;
        console.log("logged user role: ", this.loggedUserRole);
        this.hasAdminOrVolunteerRole=this.loggedUserRole==="ADMIN" || this.loggedUserRole==="VOLUNTEER";
        console.log("hasAdminOrVolunteerRole: ", this.hasAdminOrVolunteerRole);
        this.roleLoaded=true;
        this.cdr.detectChanges();
      }, 
      error: (err)=>{
        console.log(err);
        this.roleLoaded=true;
      }
    });
    this.loadAllresources();
  }

  loadAllresources() {
    this.resourcesService.getAllResources().subscribe({
      next: (response) => {
        this.resourcesList = response;
        console.log("resources list: ", this.resourcesList);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onClickCreate() {
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = true;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickCloseCreate() {
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickView() {
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = true;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickCloseView() {
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickUpdate() {
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = true;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickDelete() {
    this.openDeleteResourceForm = true;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
    this.openWayToDisasterForm=false;
  }

  onClickFetchResource() {
    this.fillDetails = true;
    const id = this.updateResourceForm.get('id')?.value;
    this.resourcesService.getResourceById(id).subscribe({
      next: (response) => {
        this.updateResourceForm.patchValue(response);
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onClickWayToDisaster(){
    this.openWayToDisasterForm=true;
    this.openDeleteResourceForm = false;
    this.openUpdateResourceForm = false;
    this.viewResourcesTable = false;
    this.openCreateResourceForm = false;
    this.fillDetails = false;
  }

  onSubmitCreate() {
    const formData = this.resourceForm.value;
    let id = "";

    this.resourcesService.createResource(formData).subscribe({
      next: (response) => {
        if (!this.resourcesList) {
          this.resourcesList = [];
        }
        id = response.id;
        this.resourcesList.push(response);
        this.resourceForm.reset();
        alert("resource created successfully with id: " + id+"please refresh the page...");
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
    this.openCreateResourceForm = false;
    this.loadAllresources();
    this.viewResourcesTable = true;
  }

  onSubmitUpdate() {
    const id = this.updateResourceForm.get('id')?.value;
    const formData = this.updateResourceForm.value;
    this.resourcesService.updateResourceById(id, formData).subscribe({
      next: (response) => {
        alert("resource with id: " + id + " updated successfully please refresh the page...");
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
    this.openUpdateResourceForm = false;
    this.loadAllresources();
    this.viewResourcesTable = true;
  }

  onSubmitDelete() {
    const id = this.deleteResourceForm.get('id')?.value;
    this.resourcesService.deleteResourceById(id).subscribe({
      next: (response) => {
        alert("resource with id : " + id + " is deleted sucessfully please refresh the page...");
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
    this.openDeleteResourceForm = false;
    this.loadAllresources();
    this.viewResourcesTable = true;
  }

  onSubmitWayToResource() {
    const resourceId = this.wayToDisasterForm.get('resourceId')?.value;
    const disasterId = this.wayToDisasterForm.get('disasterId')?.value;
    this.resourcesService.getCoordinates(resourceId).subscribe({
      next: async (startCoords) => {
        this.startingPointCoordinates = startCoords;
        this.disastersService.getCoordinates(disasterId).subscribe({
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
