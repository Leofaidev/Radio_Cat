import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatsListComponent } from './cats-list/cats-list.component';
import { CatCreateComponent } from './cat-create/cat-create.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';

const routes: Routes = [
  { path: '', component: CatsListComponent },
  { path: 'create', component: CatCreateComponent },
  { path: 'edit/:id', component: CatEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatsRoutingModule { }
