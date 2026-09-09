"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("common");

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn("pr-8", className)} />
      <button
        type="button"
        tabIndex={-1}
        aria-label={visible ? t("passwordInput.hide") : t("passwordInput.show")}
        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onPointerDown={() => setVisible(true)}
        onPointerUp={() => setVisible(false)}
        onPointerLeave={() => setVisible(false)}
        onPointerCancel={() => setVisible(false)}
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
}

export { PasswordInput };
