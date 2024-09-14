import prisma from "@/db";

export default async function DataView() {
  const fields = await prisma.workType.fields;
  return (
    <div>
      <h1>Data View</h1>
      <pre>{JSON.stringify(fields, null, 2)}</pre>
    </div>
  );
}