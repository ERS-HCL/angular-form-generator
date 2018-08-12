import { Component, OnInit } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonInput } from './types/jsonInput';
import { ValidatorsType } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public jsonInput: JsonInput[] = [{fieldName: 'firstName', type: 'text', label: 'First Name', validations: [{type: 'required', value: 'true', errorMessage: 'Firstname is required'}, {type: 'minlength', value: '5', errorMessage: 'Firstname must be 5 characters long'}]}];
  public formType: Number = 1;
  public htmlCode;
  public sanitizedHtmlCode;
  public tsCode: String;
  public generatorForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit () {
    this.generatorForm = this.formBuilder.group({
      formType: ['1'],
      jsonInput: [JSON.stringify(this.jsonInput, null, 2), Validators.required]
    });
    this.generateHtmlCode();
    this.generateTsCode();
  }

  get gf() { return this.generatorForm.controls; }

  generateHtmlCode (): void {
    const formName = this.formType === 1 ? 'name="form" (ngSubmit)="f.form.valid && onSubmit()" #f="ngForm"' : `[formGroup]="registerForm"`;
    let htmlCode = `<form ` + formName + ` novalidate>
    `;
    for (const jsonInput of this.jsonInput) {
      const inputName = this.formType === 1 ? `name="` + jsonInput.fieldName + `" [(ngModel)]="model.` + jsonInput.fieldName + `" #` + jsonInput.fieldName + `="ngModel"` : `formControlName="` + jsonInput.fieldName + `"`;
      const parentifCon = this.formType === 1 ? `f.submitted && ` + jsonInput.fieldName + `.invalid` : `submitted && f.` + jsonInput.fieldName + `.errors`;
      htmlCode += `<div class="form-group">
          <label for="` + jsonInput.label + `">` + jsonInput.label + `</label>
      `;
      htmlCode += `    <input type="text" class="form-control" ` + inputName + ` [ngClass]="{ 'is-invalid': ` + parentifCon + `}"`;
      let errorMsg = jsonInput.validations.length ? `
          <div *ngIf="` + parentifCon + `" class="invalid-feedback">` : '';
      let validation = '';
      for (const validations of jsonInput.validations) {
        validation += this.formType === 1 ? validations.type + `="` + validations.value + `" ` : '';
        const ifCon = this.formType === 1 ? '' : `f.`;
        errorMsg += `
              <div *ngIf="` + ifCon + jsonInput.fieldName + `.errors.` + validations.type + `">` + validations.errorMessage + `</div>`;
      }
      errorMsg += jsonInput.validations.length ? `
          </div>` : '';
      htmlCode += ` ` + validation + `/>` + errorMsg + `
      </div>`;
    }
    const submitFn = this.formType === 2 ? `(click)="onSubmit()"` : ``;
    htmlCode += `
      <div class="form-group">
        <button class="btn btn-primary" ` + submitFn + `>Register</button>
      </div>
</form>`;
    this.htmlCode = this.sanitizer.bypassSecurityTrustHtml(htmlCode);
    this.sanitizedHtmlCode = htmlCode;
  }

  generateTsCode (): void {
    let tsCode = '';
    if (this.formType === 2) {
      tsCode = `import { Component, OnInit } from '@angular/core';
      import { FormBuilder, FormGroup, Validators } from '@angular/forms';
      public registerForm: FormGroup;
      public submitted: Boolean = false;
      constructor(private formBuilder: FormBuilder) { }
      ngOnInit() {
        this.registerForm = this.formBuilder.group({
          `;
        for (const jsonInput of this.jsonInput) {
          const validationLength = jsonInput.validations.length;
          tsCode += jsonInput.fieldName + ` :` + ` ['', `;
          tsCode += validationLength > 1 ? `[` : `` ;
          for (const validations of jsonInput.validations) {
            const validation = ValidatorsType[validations.type] ? ValidatorsType[validations.type] + `(` + validations.value + `)` : validations.type;
            tsCode += ` Validators.` + validation + `,`;
          }
          tsCode = tsCode.slice(0, -1);
          tsCode += validationLength > 1 ? `]` : `` ;
          tsCode += ']';
        }
      tsCode +=  `
        });
      }
      get f() { return this.registerForm.controls; }
      onSubmit () {
        this.submitted = true;
        if (this.registerForm.valid) {

        }
      }`;
    } else {
      tsCode = `model: any = {};
onSubmit () {
}`;
    }
    this.tsCode = tsCode;
  }
  onSubmit () {
    if (this.generatorForm.valid) {
      this.formType = Number(this.generatorForm.value.formType);
      this.jsonInput = JSON.parse(this.generatorForm.value.jsonInput);
      this.generateHtmlCode();
      this.generateTsCode();
    } else {
      return;
    }
  }

}
