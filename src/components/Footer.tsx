export default function Footer() {
  return (
    <footer className="border-t border-border py-10 mt-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} The Journal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
