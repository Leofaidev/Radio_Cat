import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatService } from '../../core/services/cat.service';

@Component({
  selector: 'app-cat-create',
  templateUrl: './cat-create.component.html',
  styleUrls: ['./cat-create.component.scss']
})
export class CatCreateComponent {
  catForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private catService: CatService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      breed: ['', [Validators.required, Validators.maxLength(100)]],
      age: [null, [Validators.required, Validators.min(0), Validators.max(30)]],
      color: ['', [Validators.maxLength(50)]],
      is_hairy: [false]
    });
  }

  onSubmit(): void {
    if (this.catForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.catService.createCat(this.catForm.value).subscribe({
      next: () => {
        this.snackBar.open('Cat added successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/cats']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Failed to create cat. Please try again.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cats']);
  }
}
