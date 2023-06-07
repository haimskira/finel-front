import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { CartItem } from '../shared/models/cart-item';
import { Product } from './models/product';
import { Observable, map, tap,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  cartItemsChanged = new EventEmitter<void>();
  userId?: number;
  cartId?: number;
  private getUrl = 'http://localhost:8000/getcart/';
  private postUrl = 'http://localhost:8000/postcart/';


  constructor(private http: HttpClient, private authService: AuthService) {
    this.cartItems = [];
    // this.loadCartFromLocalStorage();
    this.authService.authStatus.subscribe((status: boolean) => {
      if (status) {
        this.userId = this.authService.userId!;
      } else {
        console.log("User not authenticated");
        this.userId = undefined;
        this.cartItems = [];
      }
    });
  }

  public getImageUrlForProduct(product: Product): string {
    return `http://localhost:8000${product.image}`;
  }

  getCartItems(): Observable<CartItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    if (this.cartItems.length === 0) {
      return this.http.get<any>(this.getUrl, { headers }).pipe(
        tap(response => {
          this.cartItems = response.cartItems;
          console.log("hereee" ,this.cartItems)

        }),
        map(response => response.cartItems)
      );
    } else {
      return of(this.cartItems);
    }
  }
  addToCart(product: Product) {
    const newItem: CartItem = {
      id: 0,
      product,
      quantity: 1,
      price: product.price,
      userId: this.userId
    };
  
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id && item.userId === newItem.userId
    );
  
    if (existingItem) {
      console.log("addtocart if, here = ", existingItem);
      existingItem.quantity++;
    } else {
      console.log("addtocart else, here = ", existingItem);
      this.cartItems.push(newItem);
    }
  
    const cartData = {
      cart: this.cartId,
      product: newItem.product.id,
      quantity: newItem.quantity,
      userId: this.userId
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    const addItemUrl = 'http://localhost:8000/add_cart_item/';
  
    this.http.post<any>(addItemUrl, cartData, { headers }).subscribe(
      (response) => {
        console.log('Cart item added/updated successfully');
        // Update the cart item ID after adding/updating the item on the server
        if (existingItem) {
          existingItem.id = response.cartItemId;
        } else {
          newItem.id = response.cartItemId;
        }
      },
      (error) => {
        console.error('Failed to add/update cart item:', error);
      }
    );
    this.getCartItemCount();
    this.emitCartItemsChanged();
  }
  

  clearCart() {
    this.cartItems = [];
    // this.saveCartToLocalStorage();
    this.emitCartItemsChanged();
  }


  removeFromCart(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartItem.id);
  
    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];
  
      this.deleteCartItemFromServer(item.id).subscribe(
        () => {
          this.cartItems.splice(itemIndex, 1);
          this.emitCartItemsChanged(); // Emit the event after removing the item
        },
        (error) => {
          console.error('Failed to delete cart item from server:', error);
        }
      );
    } else {
      console.log('Item not found in cart');
    }
  }
  
  deleteCartItemFromServer(cartItemId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    const deleteUrl = `${this.postUrl}delete-item/${cartItemId}/`;
  
    return this.http.delete<any>(deleteUrl, { headers }).pipe(
      tap(() => {
        // Update cart items array on successful deletion
        this.cartItems = this.cartItems.filter((item) => item.id !== cartItemId);
      })
    );
  }


  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  
  updateCartItemsOnServer(): Observable<any> {
    const cartData = {
      userId: this.userId,
      cartItems: this.cartItems.map((cartItem) => ({
        cart: cartItem.id,
        product: cartItem.product.id,
        quantity: cartItem.quantity,
        userId: this.userId
      }))
    };
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
  
    return this.http.post<any>(this.postUrl + this.cartId, cartData, { headers });
  }

  emitCartItemsChanged() {
    this.cartItemsChanged.emit();
  }
}