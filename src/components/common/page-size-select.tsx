"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

// La etiqueta va fuera del desplegable: el numero suelto no dice de que es, y repetir "/ pagina" en
// cada opcion era texto de mas.
export function PageSizeSelect({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  const t = useTranslations("common");

  return (
    <Field orientation="horizontal" className="w-fit">
      <FieldLabel htmlFor="rows-per-page">{t("rowsPerPage")}</FieldLabel>
      <Select
        value={String(value)}
        onValueChange={(next) => {
          if (next) onChange(Number(next));
        }}
      >
        <SelectTrigger id="rows-per-page" className="w-20">
          <SelectValue>{(selected: string) => selected}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
