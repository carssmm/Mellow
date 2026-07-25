import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-outline-variant py-8 bg-surface mt-auto">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-headline-md font-headline-md text-primary">
            MELLOW
          </div>
          
          <div className="text-body-md text-on-surface-variant text-center">
            &copy; {new Date().getFullYear()} Mellow Café System. Crafted with intention.
          </div>
          
          <div className="flex items-center gap-6 font-label-md text-on-surface-variant">
            <Link href="#" className="hover:text-secondary transition-colors">Support</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
