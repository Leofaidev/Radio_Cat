import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatService, Cat } from '../../core/services/cat.service';

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss']
})
export class CatsListComponent implements OnInit {
  cats: Cat[] = [];
  isLoading = true;
  displayedColumns: string[] = ['name', 'breed', 'age', 'color', 'is_hairy', 'actions'];

  constructor(
    private catService: CatService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading = true;
    this.catService.getCats().subscribe({
      next: (cats) => {
        this.cats = cats;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load cats', 'Close', { duration: 3000 });
      }
    });
  }

  editCat(cat: Cat): void {
    this.router.navigate(['/cats/edit', cat.id]);
  }

  deleteCat(cat: Cat): void {
    if (!confirm(`Are you sure you want to delete ${cat.name}?`)) return;

    this.catService.deleteCat(cat.id).subscribe({
      next: () => {
        this.cats = this.cats.filter(c => c.id !== cat.id);
        this.snackBar.open(`${cat.name} deleted successfully`, 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to delete cat', 'Close', { duration: 3000 });
      }
    });
  }

  createCat(): void {
    this.router.navigate(['/cats/create']);
  }
}
