import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReportsService } from '../../services/reports-service';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  standalone: true
})
export class Reports {

  reportsList: any[] = [];

  reportform: FormGroup;
  selectedFiles: File[] = [];
  previewUrl: string | null = null;
  previewIdx: number | null = null;
  openReportForm: boolean = false;


  constructor(private fb: FormBuilder, private reportsService: ReportsService) {
    this.reportform = this.fb.group({
      id: [''],
      type: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      ownerid: [''],
      content: ['', [Validators.required]],
      images: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4)]],
      verificationStatus: [''],
      auditTrail: ['']
    });

    if (!this.reportsList) {
      this.reportsList = [];
    }
  }

  ngOnInit() {
    console.time('loadReportsList');
    this.reportsService.getAllReports().subscribe({
      next: (response) => {
        this.reportsList = response;
        console.timeEnd('loadReportsList');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event, idx: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFiles[idx] = input.files[0];
    }
    this.reportform.get('images')?.setValue(this.selectedFiles);
  }

  previewImage(idx: number) {
    const file = this.selectedFiles[idx];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
        this.previewIdx = idx;
      };
      reader.readAsDataURL(file);
    }
  }

  onClickCreateReport() {
    this.openReportForm = !this.openReportForm;
  }

  onSubmitCreateReport(): void {
    const filesToUpload = this.selectedFiles;

    const uploadedImageUrls: string[] = [];

    const uploadPromises = filesToUpload.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'drcp_reports');

      return fetch('https://api.cloudinary.com/v1_1/dtlal1rtc/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.secure_url) {
            uploadedImageUrls.push(data.secure_url);
          }
        });
    });

    Promise.all(uploadPromises).then(() => {
      const reportData = {
        type: this.reportform.get('type')?.value,
        typeId: this.reportform.get('typeId')?.value,
        ownerid: this.reportform.get('ownerid')?.value,
        content: this.reportform.get('content')?.value,
        images: uploadedImageUrls.join(', '),
      };

      this.reportsService.createNewReport(reportData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
        }
      })
    });

    this.openReportForm = !this.openReportForm;
  }


}
