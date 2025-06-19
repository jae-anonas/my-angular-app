import { Routes } from '@angular/router';
import { LoginComponent } from './component/page/login/login.component';
import { LayoutComponent } from './component/page/layout/layout.component';
import { UserListComponent } from './component/page/user-list/user-list.component';
import { CreateUserComponent } from './component/page/create-user/create-user.component';
import { FilmListComponent } from './component/film-list/film-list.component';
import { ProfileComponent } from './component/page/profile/profile.component';
import { CartComponent } from './component/page/cart/cart.component';
import { HomeComponent } from './component/page/home/home.component';

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
        path: '',
        component: LayoutComponent,
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
                path: 'create-user',
                component: CreateUserComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'cart',
                component: CartComponent
            }
        ]
    }
];
