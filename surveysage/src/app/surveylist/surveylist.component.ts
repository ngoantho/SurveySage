import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-surveylist',
  templateUrl: './surveylist.component.html',
  styleUrl: './surveylist.component.css'
})
export class SurveylistComponent {
  displayedColumns: string[] = ['name', 'description', 'owner', 'status'];
  dataSource = new MatTableDataSource<any>();
  constructor(private router: Router, proxy$: SurveyproxyService) {
    proxy$.getListsIndex().subscribe( (result: any[]) => 
      {
        this.dataSource = new MatTableDataSource<any>(result);
        //this.dataSource.sort = this.sort;
        console.log("retrieved data from server.");
      });
  }

  ngOnInit() {
  }

  clickEvent(): void {
    this.router.navigate(['']);
  }
}
