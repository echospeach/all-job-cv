import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import JobsSearchClient from "./JobsSearchClient";

export default async function JobsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/jobs");
  }

  return <JobsSearchClient />;
}
