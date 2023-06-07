import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CartComponent } from './cart/cart.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { ContactComponent } from './contact/contact.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    CartComponent,
    ContactComponent,
    AdminComponent,
    ProfileComponent,
    HomeComponent,
    PaymentComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    NgxPayPalModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [NgbActiveModal], // Provide NgbActiveModal here
  bootstrap: [AppComponent]
})
export class AppModule { }
