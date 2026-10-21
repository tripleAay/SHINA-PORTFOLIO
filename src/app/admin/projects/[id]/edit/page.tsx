"use client";

import { useParams } from "next/navigation";
import ProjectEditor from "@/app/components/admin/ProjectEditor";

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();

  return (
    <ProjectEditor
      key={params.id}
      projectId={params.id}
    />
  );
}