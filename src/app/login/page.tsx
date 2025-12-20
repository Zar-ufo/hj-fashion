import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <AuthForm type="login" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
