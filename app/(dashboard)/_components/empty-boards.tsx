"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EmptyBoards = () => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.board.create);
  const { organization } = useOrganization();

  const onClick = () => {
    if (!organization) return;
    mutate({
      title: "无标题",
      orgId: organization.id,
    })
      .then((id) => {
        toast.success("创建成功");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("创建画板失败"));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" height={140} width={140} alt="Empty" />
      <h2 className="text-2xl font-semibold mt-6">创建你的一个画板！</h2>
      <p className="text-muted-foreground text-sm mt-2">
        开始为你的团队创建一个画板吧~
      </p>
      <div className="mt-6">
        <Button
          className="disabled:cursor-not-allowed"
          disabled={pending}
          onClick={onClick}
          size="lg"
        >
          创建画板
        </Button>
      </div>
    </div>
  );
};
