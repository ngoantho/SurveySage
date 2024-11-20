import { Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { SurveyproxyService } from '../surveyproxy.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface IResponses {
  [key: string]: number;
}

@Component({
  selector: 'app-surveylist',
  templateUrl: './surveylist.component.html',
  styleUrl: './surveylist.component.css',
})
export class SurveylistComponent {
  displayedColumns: string[] = [
    'name',
    'description',
    'owner',
    'status',
    'responses',
  ];
  dataSource = new MatTableDataSource<any>();
  proxy$ = inject(SurveyproxyService);
  responses: IResponses = {};

  constructor(private router: Router) {
    this.proxy$.getListsIndex().subscribe((result: any[]) => {
      this.dataSource = new MatTableDataSource<any>(result);
      //this.dataSource.sort = this.sort;
      console.log('retrieved data from server.');
    });

    this.proxy$.getListsIndex().subscribe(result => {
      result.forEach(survey => {
        let surveyId = String(survey.surveyId)
        this.proxy$.getSurveyResponses(surveyId).subscribe(result => {
          this.responses[surveyId] = result
        })
      })
    });
  }

  ngOnInit() {}

  clickEvent(): void {
    this.router.navigate(['']);
  }
}
