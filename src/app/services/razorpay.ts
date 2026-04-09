import { Injectable } from '@angular/core';
import { StateService } from './state';

declare var Razorpay: any;

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {

  // Razorpay Key ID — test mode
  // Replace with rzp_live_... when going to production
  private keyId = 'rzp_test_SbITgJt0xl6DPU';

  // Premium pricing
  readonly PREMIUM_PRICE = 19900; // Rs 199 in paise
  readonly PREMIUM_PRICE_DISPLAY = '₹199';
  readonly PREMIUM_NAME = 'EatWell Premium';
  readonly PREMIUM_DESCRIPTION = 'Unlock all features — one-time purchase';

  constructor(private state: StateService) {}

  isPremiumUser(): boolean {
    const premium = localStorage.getItem('eatwell_premium');
    return premium === 'true';
  }

  unlockPremium(paymentId: string): void {
    localStorage.setItem('eatwell_premium', 'true');
    localStorage.setItem('eatwell_payment_id', paymentId);
    localStorage.setItem('eatwell_premium_date', new Date().toISOString());
  }

  openCheckout(): Promise<PaymentResult> {
    return new Promise((resolve) => {

      const options = {
        key: this.keyId,
        amount: this.PREMIUM_PRICE,
        currency: 'INR',
        name: 'EatWell',
        description: this.PREMIUM_DESCRIPTION,
        image: 'assets/icon/favicon.png',
        prefill: {
          contact: '',
          email: ''
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  { method: 'upi', flows: ['qrcode', 'collect', 'intent'] }
                ]
              },
              other: {
                name: 'Other Methods',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' }
                ]
              }
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        theme: {
          color: '#1D9E75'
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          }
        },
        handler: (response: any) => {
          // Payment successful
          const paymentId = response.razorpay_payment_id;
          this.unlockPremium(paymentId);
          resolve({ success: true, paymentId });
        }
      };

      try {
        const rzp = new Razorpay(options);

        rzp.on('payment.failed', (response: any) => {
          resolve({
            success: false,
            error: response.error?.description || 'Payment failed'
          });
        });

        rzp.open();
      } catch (err) {
        resolve({ success: false, error: 'Razorpay not loaded' });
      }
    });
  }
}
