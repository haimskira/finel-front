import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/Services/api.service';
import { Product } from '../../shared/models/product';
import { CartService } from '../../shared/Services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  cartItems: any;

  constructor(private apiService: ApiService, private cartService: CartService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe(
      (products: Product[]) => {
        // console.log(products);
        
        this.products = products.map(product => ({
          ...product,
          image_url: `http://localhost:8000${product.image}`,
          quantity: 0
        }));
      },
      error => {
        console.log('Error:', error);
      }
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  removeFromCart(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }

  getTotalQuantity(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }
}
