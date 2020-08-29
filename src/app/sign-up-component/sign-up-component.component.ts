import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime} from 'rxjs/operators'




function regexEmail(email:string): boolean{

  const regex= /([A-Z]||[a-z])\w+@([A-Z]||[a-z])\w+(\.)([A-Z]||[a-z])\w+/g;
  const match= regex.exec(email);

  if(match){
    // console.log("verdadero xD")
    return true;
  }
  return false;

  
}




@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up-component.component.html',
  styleUrls: ['./sign-up-component.component.css']
})
export class SignUpComponentComponent implements OnInit {

 
  

  states=[]
  userForm: FormGroup;
  validationMessage:string;

  private validationMessages={
    minLength:"can't be less than 3 characters",
    maxLength:"can't be longer than 25 characters",
    required: 'required field'
    
  };
 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({

      firstName: ['', [Validators.maxLength(25), Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.maxLength(25), Validators.minLength(3), Validators.required]],

      //dateOfBirth: ['', [Validators.required]],

      // email1: ['', [Validators.required]],
      // email2: ['', [Validators.required]],
      // email: ['', [Validators.email]],

      // email: [this.fb.group({
      //   email1: ['', [Validators.required]],
      //   email2: ['', [Validators.required]],
      // }), [Validators.email]],

      email:this.fb.group({
        email1: ['', [Validators.required]],
         email2: ['', [Validators.required]],
       }),
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      newsletter: false,
      terms: [false, [Validators.requiredTrue]]


    })
    
    var listOfStates;

    this.userForm.get('email').valueChanges.pipe(
      debounceTime(300)
    ).subscribe(
      val=> {
        console.log(val.email1)

       
         
         if (regexEmail(val.email1)){
           this.userForm.get('email.email2').clearValidators();
           this.userForm.get('email.email2').disable();
           this.userForm.get('email.email2').updateValueAndValidity();
         }else{
          this.userForm.get('email.email2').setValidators(Validators.required)
          this.userForm.get('email.email2').enable();
          this.userForm.get('email.email2').updateValueAndValidity();
         }

         

       
        
      }
    )
    
    this.userForm.get('country').valueChanges.subscribe(
         (country)=>{
          country=country.toLowerCase();
          console.log(country);
          listOfStates=this.fnCallback(this[country]);
          this.states= listOfStates  ;
      })


    const firstNameValidation=this.userForm.get('firstName');
    firstNameValidation.valueChanges.subscribe(
      value=>this.setMessage(firstNameValidation)
      );
      
    this.userForm.get('state').valueChanges.subscribe(  //no muestra nada en consola
      val=>console.log(val)
      )

  }


  fnCallback(fn){
    return fn();
  }
  mexico(): Array<String> {
    return ["Jalisco", "Michoacan", "Zacatecas", "Coahuila", "Durango", "Colima"]
}
usa(): Array<String> {
  return ["usa1", "usa2","usa3"]
}

  save() {
    alert("savexd")
  }
  setMessage(c: AbstractControl): void {
    this.validationMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.validationMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }
  populateData(): void {
    this.userForm.patchValue({

      firstName: 'Sergio',
      lastName: 'Salazar',
      dateOfBirth:'01/01/98',
      email1: 'sergioSAO5',
      email2: 'hotmail.com',
      email: 'sergioSAO5@hotmail.com',
      country: 'Mexico',
      state:  'Jalisco',
      terms: true
    })
  }


  
}
