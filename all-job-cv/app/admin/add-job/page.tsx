import AddJobForm from "./AddJobForm";

export default async function AddJobPage() {
  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Add a sponsor job</h1>
      <AddJobForm />
    </div>
  );
}
