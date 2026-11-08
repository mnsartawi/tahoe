import clsx from "clsx"
import { avatarGradient } from "@/lib/account"

export const isImageAvatar = (avatar: string) =>
  avatar.startsWith("/") || avatar.startsWith("data:") || avatar.startsWith("http")

export default function Avatar({ emoji, className }: { emoji: string; className?: string }) {
  if (isImageAvatar(emoji)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={emoji}
        alt=""
        draggable={false}
        className={clsx("shrink-0 rounded-full object-cover", className)}
      />
    )
  }
  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-b",
        avatarGradient(emoji),
        className
      )}
    >
      {emoji}
    </span>
  )
}
