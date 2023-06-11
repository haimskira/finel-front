import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgxPayPalModule } from 'ngx-paypal';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartService } from '../../shared/Services/cart.service';
import { CartItem } from '../../shared/models/cart-item';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  showSuccess!: any;
  cartTotal!: any;
  cartItems: CartItem[] = [];



  constructor(private router: Router,   public cartService: CartService, private http: HttpClient  ) {}

  ngOnInit() {
    this.initConfig();
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.cartTotal = this.getTotalPrice();
    });
  }
  
  loadCartItems(): void {
    if (this.cartService.cartItems.length === 0) {
      this.cartService.getCartItems().subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.cartTotal = this.getTotalPrice();
      });
    } else {
      this.cartItems = this.cartService.cartItems;
      this.cartTotal = this.getTotalPrice();
    }
  }

  getCartItemCount(): number {
    return this.cartService.getCartItemCount();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0);
  }
  
// #################################################################################################################################
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'ILS',
      clientId: `${environment.Client_ID}`,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'ILS',
                value: `${this.cartTotal}`,
                breakdown: {
                  item_total: {
                    currency_code: 'ILS',
                    value: `${this.cartTotal}`,
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'ILS',
                    value: `${this.cartTotal}`,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        if (data.status === 'COMPLETED') {
          const itemToPurchase = this.cartItems.find(item => item.id === item.id);
      
          if (itemToPurchase) {
            // Create the purchase entry in Django
            this.cartService.createPurchase(itemToPurchase).subscribe(
              () => {
                this.cartService.removeFromCart(itemToPurchase);
                this.router.navigate(['/']);
              },
              (error) => {
                console.error('Failed to create purchase:', error);
              }
            );
      
            this.showSuccess = true;
            window.alert('Transaction completed successfully!');
          } else {
            console.log('Item not found in cart');
          }
        }
      },      
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
