import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
});

export const isMockKey = () => {
  return !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_yourkeyhere';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateCardNumber = () => {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `ABF${randomNum}`;
};
