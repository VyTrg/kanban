import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Link from "next/link";

export default function Home() {
  // return (
  //   <div className="h-full w-full p-6">
  //     <div className="mx-auto max-w-4xl">
  //       <h1 className="text-2xl font-semibold tracking-tight">Kanban</h1>
  //       <p className="mt-2 text-sm text-muted-foreground">
  //         Open a workspace to view boards.
  //       </p>
  //       <Link
  //         className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
  //         href="/workspaces/default/boards"
  //       >
  //         Go to default workspace
  //       </Link>
  //     </div>
  //   </div>
  // );
    return (
    <div className="flex h-screen w-full ">
      <AppSidebar />
      <main className="flex-1"></main>
    </div>
  );
}
