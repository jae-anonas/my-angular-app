import { Routes } from '@angular/router';
import { LoginComponent } from './component/page/login/login.component';
import { LayoutComponent } from './component/page/layout/layout.component';
import { UserListComponent } from './component/page/user-list/user-list.component';
import { CreateUserComponent } from './component/page/create-user/create-user.component';
import { FilmListComponent } from './component/film-list/film-list.component';
import { ProfileComponent } from './component/page/profile/profile.component';
import { CartComponent } from './component/page/cart/cart.component';
import { HomeComponent } from './component/page/home/home.component';
import { AuthGuard } from './service/auth.guard';
import { FilmDetailsComponent } from './component/page/film-details/film-details.component';
import { InventoryComponent } from './component/page/inventory/inventory.component';
import { AddFilmComponent } from './component/page/add-film/add-film.component';
import { ActiveRentalsComponent } from './component/page/active-rentals/active-rentals.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login', 
        component: LoginComponent
    },
    {
        path: 'create-user',
        component: CreateUserComponent
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'films',
                component: FilmListComponent
            },
            {
                path: 'user-list',
                component: UserListComponent
            },
            {
                path: 'profile/:id',
                component: ProfileComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
            {
                path: 'active-rentals',
                component: ActiveRentalsComponent
            },
            {
                path: 'film/:id',
                component: FilmDetailsComponent
            },
            {
                path: 'inventory',
                component: InventoryComponent
            },
            {
                path: 'add-film',
                component: AddFilmComponent
            }
        ]
    }
];
