import 'dotenv/config';
import { testEmailConfiguration } from './src/lib/email';

(async () => {
  try {
    const result = await testEmailConfiguration();
    console.log('Email configuration test result:', result);
  } catch (err) {
    console.error('Error during testEmailConfiguration:', err);
  }
})();