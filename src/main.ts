
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AdminGuard } from './app/guards/admin-guard.guard';
import { ModeratorGuard } from './app/guards/moderator-guard.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    AdminGuard,
    ModeratorGuard
  ]
}).catch(err => console.error(err));
