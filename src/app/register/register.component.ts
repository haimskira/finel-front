import { Component, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/auth-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string;
  email: string;
  password: string;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false; // Add a flag for displaying the error message
  errorMessage: string = ''; // Add a variable to store the error message
  registrationSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public modal: NgbActiveModal, private authService: AuthService) {
    this.username = '';
    this.email = '';
    this.password = '';
  }

  register() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.authService.register(user).subscribe(
      (data) => {
        // Handle successful registration
        console.log(data);
        this.showSuccessMessage = true; // Set the flag to show the success message
        this.registrationSuccess.emit(true);
        setTimeout(() => {
          this.modal.close('success');
        }, 3000);
      },
      (error) => {
        // Handle registration error
        console.log(error);
        let errorMessage = 'An error occurred during registration.'; // Default error message
        
        // Check if the error object returned by Django has an 'error' property
        if (error.error && error.error.error) {
          errorMessage = error.error.error; // Assign the error message from the 'error' property
        }
        
        this.errorMessage = errorMessage; // Assign the error message to display to the user
      }
    );
  }
  
}
