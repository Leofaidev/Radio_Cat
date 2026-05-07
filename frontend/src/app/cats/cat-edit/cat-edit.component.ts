import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatService, Cat } from '../../core/services/cat.service';

@Component({
  selector: 'app-cat-edit',
  templateUrl: './cat-edit.component.html',
  styleUrls: ['./cat-edit.component.scss']
})
export class CatEditComponent implements OnInit {
  catForm: FormGroup;
  isLoading = false;
  isFetching = true;
  errorMessage = '';
  catId: number = 0;

  constructor(
    private fb: FormBuilder,
    private catService: CatService,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.catId = Number(this.route.snapshot.paramMap.get('id'));
    this.catService.getCat(this.catId).subscribe({
      next: (cat: Cat) => {
        this.catForm.patchValue({
          name: cat.name,
          breed: cat.breed,
          age: cat.age,
          color: cat.color,
          is_hairy: cat.is_hairy
        });
        this.isFetching = false;
      },
      error: () => {
        this.isFetching = false;
        this.snackBar.open('Cat not found', 'Close', { duration: 3000 });
        this.router.navigate(['/cats']);
      }
    });
  }

  onSubmit(): void {
    if (this.catForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.catService.updateCat(this.catId, this.catForm.value).subscribe({
      next: () => {
        this.snackBar.open('Cat updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/cats']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Failed to update cat.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/cats']);
  }
}
