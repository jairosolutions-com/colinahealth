import { Navbar } from "@/components/navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="h-full w-full flex items-center justify-center">
        {children}
      </div>
    </>
  );
}
