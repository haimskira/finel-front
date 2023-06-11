import { Profile } from '../../shared/models/profile.model';
import { ProfileService } from '../../shared/Services/profile-service.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profiles: Profile[] = [];
  currentProfile: Profile | null = null;
  purchases: any[] = [];

  constructor(
    private profileService: ProfileService,
    private modalService: NgbModal,
    private location: Location
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.profileService.uploadPhoto(file).subscribe(
      () => {
        console.log("Image uploaded");
        this.refreshPage();
      },
      (error) => {
        console.error("Error uploading image:", error);
      }
    );
  }

  ngOnInit(): void {
    this.loadProfile();
    this.profileService.fetchProfile();
    this.getPurchaseHistory();

  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe(
      (profiles: Profile[]) => {
        if (profiles.length > 0) {
          this.currentProfile = profiles[0];
          console.log(this.currentProfile);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateProfile(): void {
    if (this.currentProfile) {
      this.profileService.updateProfile(this.currentProfile).subscribe(
        (updatedProfile: Profile) => {
          console.log("Profile updated:", updatedProfile);
          this.currentProfile = updatedProfile;
          this.refreshPage();
        },
        (error) => {
          console.log("Error updating profile:", error);
        }
      );
    }
  }

  openConfirmationModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  deleteProfile(): void {
    const pk = this.currentProfile?.pk;
    if (pk) {
      this.profileService.deleteProfile(pk).subscribe(
        () => {
          this.profiles = this.profiles.filter((profile) => profile.pk !== pk);
          this.currentProfile = null;
          this.refreshPage();
        },
        (error) => {
          console.error('Error deleting profile:', error);
        }
      );
    }
  }

  getPurchaseHistory(): void {
    this.profileService.getPurchaseHistory().subscribe(
      (purchases: any[]) => {
        this.purchases = purchases.map(purchase => {
          const product = {
            name: purchase.product_name,
            price: purchase.product_price,
            image: purchase.product_image  // Assign the actual image URL from the API response
          };
          return { ...purchase, product };
        });
      },
      (error: any) => {
        console.error('Failed to fetch purchase history:', error);
      }
    );
  }
  
  private refreshPage(): void {
    this.location.go(this.location.path());
    window.location.reload();
  }
}
