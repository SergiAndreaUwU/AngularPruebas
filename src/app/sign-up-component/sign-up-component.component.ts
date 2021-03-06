import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http'
function regexEmail(email: string): boolean {
  const regex = /([A-Z])\w+@([A-Z])\w+(\.)([A-Z])\w+/gi;
  const match = regex.exec(email);

  if (match) {

    return true;
  }
  return false;
}

function regexEmail2(email: string): boolean {
  const regex = /([A-Z])\w+(\.)([A-Z])\w+/gi;
  const match = regex.exec(email);

  if (match) {

    return true;
  }
  return false;
}

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up-component.component.html',
  styleUrls: ['./sign-up-component.component.css'],
})
export class SignUpComponentComponent implements OnInit {
  states = [];
  userForm: FormGroup;
  firstNameValidationField: string;
  lastNameValidationField: string;
  emailValidationField: string;
  termsValidationField: string;


  private validationMessages = {
    minlength: "can't be less than 3 characters",
    maxlength: "can't be longer than 25 characters",
    required: 'required field',
  };

  constructor(private fb: FormBuilder, private http:HttpClient) {
   
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.required,
        ],
      ],
      lastName: [
        '',
        [
          Validators.maxLength(25),
          Validators.minLength(3),
          Validators.required,
        ],
      ],

      email: this.fb.group({
        email1: ['', [Validators.required]],
        email2: ['', [Validators.required],],
      }),
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      newsletter: false,
      terms: [false, [Validators.requiredTrue]],
    });

    var listOfStates;

    this.userForm
      .get('email.email1')
      .valueChanges.pipe(debounceTime(300))
      .subscribe(
        (val) => {
          console.log(val);

          if (regexEmail(val)) {
            this.userForm.get('email.email2').clearValidators();
            this.userForm.get('email.email2').disable();
            this.userForm.get('email.email2').setValue("");
            
          } else {
            this.userForm
              .get('email.email2')
              .setValidators(Validators.required);
            this.userForm.get('email.email2').enable();

          }
          this.userForm.get('email.email2').updateValueAndValidity();
        },

      );

    this.userForm.get('country').valueChanges.subscribe((country) => {
      country = country.toLowerCase();
      console.log(country);
      listOfStates = this.fnCallback(this[country]);
      this.states = listOfStates;
      this.userForm.get('state').setValue("");
    });



    const firstNameValidation = this.userForm.get('firstName');

    firstNameValidation.valueChanges.subscribe(() =>{
      this.firstNameValidationField= this.setMessage(firstNameValidation)
      }
    );
    const lastNameValidation = this.userForm.get('lastName');
    lastNameValidation.valueChanges.subscribe(() =>{
      this.lastNameValidationField= this.setMessage(lastNameValidation)
      }
    );
    const emailValidation = this.userForm.get('email.email1');
    emailValidation.valueChanges.subscribe(() =>{
      this.emailValidationField= this.setMessage(emailValidation)
      
      console.log(this.emailValidationField)
      }
    );
  
    const termsValidation = this.userForm.get('terms');
    termsValidation.valueChanges.subscribe(() =>{
      this.termsValidationField= this.setMessage(termsValidation)
      }
    );
      //setParent, updateOn,statusChange
      

    this.userForm.get('state').valueChanges.subscribe(
      (val) => console.log(val)
    );
  }

  fnCallback(fn) {
    return fn();
  }
  mexico(): Array<String> {
    return [
      'Jalisco',
      'Michoacan',
      'Zacatecas',
      'Coahuila',
      'Durango',
      'Colima',
    ];
  }
  usa(): Array<String> {
    return ['usa1', 'usa2', 'usa3'];
  }

  save() {
    alert('savexd');
  }


  setMessage(c: AbstractControl): string {

    if ((c.touched || c.dirty) && c.errors) {
      return Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }


  }
  populateData() {
    // this.userForm.patchValue({
    //   firstName: 'Sergio',
    //   lastName: 'Salazar',
    //  // dateOfBirth: '01/01/98',
    //   email1: 'sergioSAO5',
    //   email2: 'hotmail.com',
    //   email: 'sergioSAO5@hotmail.com',
    //   country: 'Mexico',
    //   state: 'Jalisco',
    //   terms: true,
    // });

  }

}
