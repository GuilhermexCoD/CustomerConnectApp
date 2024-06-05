import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { ClientListComponent } from './clients/client-list/client-list.component';

const routes: Routes = [
  { path: 'clients', redirectTo: 'clients/list', pathMatch: 'full'},
  { 
    path: 'clients', component: ClientsComponent,
    children: [
      { path: 'detail/:id', component: ClientDetailComponent },
      { path: 'detail', component: ClientDetailComponent },
      { path: 'list', component: ClientListComponent },
    ]
  },
  { path: '', redirectTo: 'clients/list' , pathMatch: 'full'},
  { path: '**', redirectTo: 'clients/list', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
