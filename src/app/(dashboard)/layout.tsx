import { TopNav } from "@/components/layout/top-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <TopNav />
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8 md:py-12 pb-24 lg:pb-12">
        {children}
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}

