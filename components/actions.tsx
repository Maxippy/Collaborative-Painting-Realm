"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useRenameModal } from "@/store/use-rename-modal";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

/**
 * @name Actions
 * @description Actions component is built on top of shadcn DropdownMenu component to allow users to do various actions (copy link url, rename the board, and delete the board) on the board they created
 * @param param0 children accepts React elements (JSX Elements) to let user open the dropdown menu (required)
 * @param param1 side accepts an argument of type DropdownMenuContentProps["side"] (optional)
 * @param param2 sideOffset accepts an argument of type DropdownMenuContentProps["sideOffset"] (optional)
 * @param param3 id accepts an argument of type string (id of the board) (required)
 * @param param4 title accepts an argument of type title (title of the board) (required)
 * @returns JSX Element
 */
export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove)

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("链接已剪切到粘贴板"))
      .catch(() => toast.error("复制链接失败"))
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("成功删除画板"))
      .catch(() => toast.error("删除画板失败"))
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" />
          复制画板链接
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          重命名
        </DropdownMenuItem>
        <ConfirmModal
          header="删除画板？"
          description="这将删除画板及其所有内容"
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            删除
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
