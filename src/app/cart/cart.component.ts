import { Component, OnInit } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { CartItem } from '../shared/models/cart-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCartItems();
    this.cartService.cartItemsChanged.subscribe(() => {
      this.loadCartItems();
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      // console.log("cart ts. loadcartItems =", this.cartItems);
    });
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  decreaseQuantity(cartItem: CartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    }
  }

  increaseQuantity(cartItem: CartItem) {
    cartItem.quantity++;
  }

  removeFromCart(cartItem: CartItem) {
    console.log(cartItem.id);
    this.cartService.removeFromCart(cartItem);
  }
  

  getCartItemCount(): number {
    return this.cartItems.reduce((count, cartItem) => count + cartItem.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, cartItem) => total + cartItem.product.price * cartItem.quantity, 0);
  }
}
