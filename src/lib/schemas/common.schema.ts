import z from "zod";
import common from "@/messages/en/common.json";

export const descriptionSchema = z.string().trim().max(500, common.validation.descriptionMaxLength).optional();
