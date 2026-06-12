import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}