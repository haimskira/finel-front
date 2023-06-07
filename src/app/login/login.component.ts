import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../shared/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;
  loggedIn: boolean = false;
  welcomeMessage: string;
  showLoginForm: boolean;
  registrationSuccess: boolean = false;

  
  constructor(
    private authService: AuthService,  
    private router: Router,  
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.loggedIn = false;
    this.welcomeMessage = '';
    this.showLoginForm = true; 
    this.loggedIn = this.authService.loggedIn;
  }
  openRegister() {
    const modalRef = this.modalService.open(RegisterComponent);
    modalRef.componentInstance.registrationSuccess.subscribe((success: boolean) => {
      this.registrationSuccess = success;
    }).add(() => {
      // Clean up the subscription when the modal is closed
      modalRef.componentInstance.registrationSuccess.unsubscribe();
    });
    this.activeModal.dismiss();
  }

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (data) => {
        console.log(data);
        const accessToken = data.access; // Assuming the access token property is named 'access_token' in the response
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken); // Store the access token in the local storage
          this.authService.loggedIn = true;
          this.authService.username = this.username;
          this.activeModal.close('success');
          window.location.reload(); // Refresh the page to display the cart items
        } else {
          console.error('Access token not found in the response');
        }
      },
      (error) => {
        console.log(error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
