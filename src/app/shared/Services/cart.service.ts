import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';
import { Observable, map, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];
  cartItemsChanged = new EventEmitter<void>();
  userId?: number;
  cartId?: number;

  private baseUrl = 'http://localhost:8000';
  private getUrl = `${this.baseUrl}/cart/`;
  private deleteUrl = `${this.baseUrl}/cart/delete-item/`;
  private purchaseURL = `${this.baseUrl}/purchase/`;
  private addItemUrl = `${this.baseUrl}/add_cart_item/`;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.cartItems = [];

    // Subscribe to authentication status changes
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

  /**
   * Create a purchase for a cart item
   * @param item The cart item to create a purchase for
   * @returns An observable that represents the HTTP POST request
   */
  createPurchase(item: CartItem): Observable<any> {
    const purchaseData = {
      productId: item.product.id,
      quantity: item.quantity,
    };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    console.log("purchaseData = ", purchaseData);
    return this.http.post(this.purchaseURL, purchaseData, { headers });
  }

  /**
   * Get the image URL for a product
   * @param product The product to get the image URL for
   * @returns The image URL for the product
   */
  public getImageUrlForProduct(product: Product): string {
    return `${this.baseUrl}${product.image}`;
  }

  /**
   * Get the cart items
   * @returns An observable that emits the cart items
   */
  getCartItems(): Observable<CartItem[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

    // Check if cart items are already loaded
    if (this.cartItems.length === 0) {
      return this.http.get<any>(this.getUrl, { headers }).pipe(
        tap(response => {
          this.cartItems = response.cartItems;
        }),
        map(response => response.cartItems)
      );
    } else {
      // Return cart items from memory
      return of(this.cartItems);
    }
  }

  /**
   * Add a product to the cart
   * @param product The product to add to the cart
   */
  addToCart(product: Product) {
    const newItem: CartItem = {
      id: 0,
      product,
      quantity: 1,
      price: product.price,
      userId: this.userId
    };

    // Check if the product already exists in the cart
    const existingItem = this.cartItems.find(
      (item) => item.product.id === product.id && item.userId === newItem.userId
    );

    // Increment the quantity if the product exists, otherwise add it to the cart
    if (existingItem) {
      existingItem.quantity++;
    } else {
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

    // Add/update the cart item on the server
    this.http.post<any>(this.addItemUrl, cartData, { headers }).subscribe(
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

  /**
   * Clear the cart
   */
  clearCart() {
    this.cartItems = [];
    this.emitCartItemsChanged();
  }

  /**
   * Remove an item from the cart
   * @param cartItem The cart item to remove
   */
  removeFromCart(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === cartItem.id);

    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];

      // Delete the cart item from the server
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

  /**
   * Delete a cart item from the server
   * @param cartItemId The ID of the cart item to delete
   * @returns An observable that represents the HTTP DELETE request
   */
  deleteCartItemFromServer(cartItemId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });

    return this.http.delete<any>(this.deleteUrl + cartItemId, { headers }).pipe(
      tap(() => {
        this.cartItems = this.cartItems.filter((item) => item.id !== cartItemId);
      })
    );
  }

  /**
   * Get the total count of items in the cart
   * @returns The total count of items in the cart
   */
  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Emit the cart items changed event
   */
  emitCartItemsChanged() {
    this.cartItemsChanged.emit();
  }
}
