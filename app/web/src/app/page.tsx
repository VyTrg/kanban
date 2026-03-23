import { AppSidebar } from "@/components/sidebar/app-sidebar";
export default function Home() {
  return (
    <div className="flex h-screen w-full ">
      <AppSidebar />
      <main className="flex-1"></main>
    </div>
  );
}
