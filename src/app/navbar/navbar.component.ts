import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/auth-service.service';
import { CartService } from '../shared/cart.service';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isCartOpen = false; // Flag to control the cart component visibility
  cartItemCount = 0;

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartItemCount = this.cartService.getCartItemCount(); // Initialize the cart counter
    this.cartService.cartItemsChanged.subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
      this.cdr.detectChanges(); // Trigger change detection
    });
  }

  openLogin() {
    const modalRef = this.modalService.open(LoginComponent);
  }

  logout() {
    this.authService.logout();
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      this.cartItemCount = this.cartService.getCartItemCount();
      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isCartButton = target.closest('.btn-outline-dark');
    const isCartComponent = target.closest('app-cart');
    
    if (!isCartButton && !isCartComponent) {
      this.isCartOpen = false;
      this.cdr.detectChanges(); // Trigger change detection
    }
  }
}
