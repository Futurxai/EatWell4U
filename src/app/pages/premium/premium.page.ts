import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { RazorpayService } from '../../services/razorpay';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
  standalone: false
})
export class PremiumPage {

  isPremium = false;
  isLoading = false;
  price: string;

  features = [
    { icon: '🍽️', title: 'Unlimited Meal Plans', desc: 'Create unlimited weekly meal plans with 50+ Indian recipes' },
    { icon: '📊', title: 'Advanced Nutrition', desc: 'Detailed macro tracking — protein, carbs, fat, fiber, vitamins' },
    { icon: '📷', title: 'Food Scanner', desc: 'Camera food detection with healthier swap suggestions' },
    { icon: '📋', title: 'Smart Grocery List', desc: 'Auto-generated shopping list from your meal plan' },
    { icon: '📥', title: 'PDF Export', desc: 'Export weekly plans and grocery lists as PDF' },
    { icon: '🌙', title: 'Dark Mode', desc: 'Full dark theme for comfortable use at night' },
    { icon: '🔔', title: 'Meal Reminders', desc: 'Daily push notifications for breakfast, lunch, snack, dinner' },
    { icon: '🚫', title: 'No Ads', desc: 'Completely ad-free experience forever' },
  ];

  constructor(
    private razorpay: RazorpayService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.price = this.razorpay.PREMIUM_PRICE_DISPLAY;
    this.isPremium = this.razorpay.isPremiumUser();
  }

  async buyPremium() {
    this.isLoading = true;

    const result = await this.razorpay.openCheckout();

    this.isLoading = false;

    if (result.success) {
      this.isPremium = true;

      const alert = await this.alertCtrl.create({
        header: '🎉 Welcome to Premium!',
        message: 'All features are now unlocked. Enjoy EatWell Premium!',
        buttons: [{
          text: 'Start Using',
          handler: () => {
            this.router.navigate(['/tabs/dashboard']);
          }
        }]
      });
      await alert.present();

    } else if (result.error !== 'Payment cancelled') {
      const toast = await this.toastCtrl.create({
        message: result.error || 'Payment failed. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  goBack() {
    this.router.navigate(['/tabs/profile']);
  }
}
