import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, share, shareReplay } from 'rxjs';
import { Employee } from 'src/app/Models/Employee';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees!: Observable<Employee[]>;
  constructor(private emp: EmployeeService) { }
  error: string = ""

  ngOnInit(): void {
    this.getEmployee();
  }
  private getEmployee() {
    this.employees = this.emp.getAllEmployees().pipe(
      map(x => {
        if (x.length == 0) throw new Error("an error occured")
        else return x;
      }),
      catchError(err => {
        this.error = err;
        return []
      }),
      shareReplay()
    )

  }
}
