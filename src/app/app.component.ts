import { Component, OnInit } from '@angular/core';
import { JsonInput } from './types/jsonInput';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public jsonInput: JsonInput[] = [{fieldName: 'firstName', type: 'text', validations: [{type: 'required', value: 'true', errorMessage: 'Firstname is required'}, {type: 'minlength', value: '5', errorMessage: 'Firstname must be 5 characters long'}]}];
  public formType: Number = 2;
  public htmlCode: String;
  public tsCode: String;

  ngOnInit () {
    this.generateHtmlCode();
    this.generateTsCode();
  }

  generateHtmlCode () {
    const formName = this.formType === 1 ? 'name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm"' : '[formGroup]="registerForm" (ngSubmit)="onSubmit()"';
    let htmlCode = '<form ' + formName + ' novalidate>';
    for (const jsonInput of this.jsonInput) {
      const inputName = this.formType === 1 ? 'name="' + jsonInput.fieldName + '" [(ngModel)]="model.' + jsonInput.fieldName + '" #' + jsonInput.fieldName + '="ngModel"' : 'formControlName="' + jsonInput.fieldName + '"';
      const parentifCon = this.formType === 1 ? 'f.submitted && ' + jsonInput.fieldName + '.invalid' : 'submitted && f.' + jsonInput.fieldName + '.errors';
      htmlCode += '<div class="form-group"><label for="' + jsonInput.fieldName + '">' + jsonInput.fieldName + '</label>';
      htmlCode += '<input type="text" class="form-control" ' + inputName + ' [ngClass]="{ \'is-invalid\': ' + parentifCon + ' }"';
      let errorMsg = jsonInput.validations.length ? '<div *ngIf="' + parentifCon + '" class="invalid-feedback">' : '';
      let validation = '';
      for (const validations of jsonInput.validations) {
        validation += validations.type + '=' + validations.value;
        const ifCon = this.formType === 1 ? '' : 'f.';
        errorMsg += '<div *ngIf="' + ifCon + jsonInput.fieldName + '.errors.' + validations.type + '">' + validations.errorMessage + '</div>';
      }
      errorMsg += jsonInput.validations.length ? '</div>' : '';
      htmlCode += '/>' + errorMsg + '</div>';
    }
    htmlCode += '<div class="form-group"><button class="btn btn-primary">Register</button></div></form>';
    console.log(htmlCode);
  }

  generateTsCode () {

  }

}
