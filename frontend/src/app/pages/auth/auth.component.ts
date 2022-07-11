import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnDestroy {

  private destroy$ = new Subject<void>()

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.listenFragment()
  }

  listenFragment(): void {
    this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe(hashParams => {
      if (!hashParams) {
        this.router.navigateByUrl('/home');
      } else {
        this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
          if (user) {
            this.router.navigateByUrl('/home');
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
