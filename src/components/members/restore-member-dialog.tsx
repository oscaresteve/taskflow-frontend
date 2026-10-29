"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormDialog } from "@/components/common/form-dialog";
import { RoleSelect } from "@/components/members/role-select";
import { MemberRole } from "@/lib/dtos/members.dto";

interface RestoreMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Cadenas ya traducidas: el mismo dialogo sirve para readmitir en el espacio y para reactivar en
  // un proyecto, y cada ambito tiene sus propios textos.
  title: string;
  description: string;
  roleLabel: string;
  roleDescription: string;
  submitLabel: string;
  formId: string;
  assignableRoles: MemberRole[];
  pending?: boolean;
  onConfirm: (role: MemberRole) => void;
}

// La baja machaca el rol, asi que la vuelta tiene que elegirlo. Por eso esto no es un ConfirmDialog
// (no acepta contenido) sino el mismo FormDialog + RoleSelect que usa el alta de miembros. No lleva
// react-hook-form ni esquema: es un unico select con valor por defecto y sin nada que validar.
export function RestoreMemberDialog({
  open,
  onOpenChange,
  title,
  description,
  roleLabel,
  roleDescription,
  submitLabel,
  formId,
  assignableRoles,
  pending = false,
  onConfirm,
}: RestoreMemberDialogProps) {
  const t = useTranslations("common");
  const [role, setRole] = useState<MemberRole>("MEMBER");

  // Al cerrar se vuelve a MEMBER: el rol de la vez anterior era de otra persona.
  function handleOpenChange(next: boolean) {
    if (!next) setRole("MEMBER");
    onOpenChange(next);
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      formId={formId}
      submitLabel={submitLabel}
      cancelLabel={t("actions.cancel")}
      pending={pending}
    >
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          onConfirm(role);
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={`${formId}-role`}>{roleLabel}</FieldLabel>
            <RoleSelect
              id={`${formId}-role`}
              className="justify-between"
              value={role}
              values={assignableRoles}
              onValueChange={setRole}
            />
            <FieldDescription>{roleDescription}</FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
