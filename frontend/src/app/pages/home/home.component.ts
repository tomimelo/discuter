import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private supabaseService: SupabaseService) { }

  ngOnInit(): void {
  }

  join(name: string): void {
    console.log(name);
    this.router.navigateByUrl('/room');
  }

  async signIn(): Promise<void> {
    const data = await this.supabaseService.signIn();
  }

}
