import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { CartComponent } from './Components/cart/cart.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { ContactComponent } from './Components/contact/contact.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './Components/admin/admin.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { HomeComponent } from './Components/home/home.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { PaymentComponent } from './Components/payment/payment.component';


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
