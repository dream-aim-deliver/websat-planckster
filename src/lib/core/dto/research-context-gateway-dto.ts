import { z } from "zod";

import { DTOSchemaFactory, BaseErrorDTOSchema } from "@/sdk/core/dto";
import { ResearchContextSchema } from "~/lib/core/entity/kernel-models"

export const GetResearchContextDTOSchema = DTOSchemaFactory(
    ResearchContextSchema.merge(z.object({
        message: z.string().optional(),
        context: z.any().optional(),
    })), BaseErrorDTOSchema);
export type TGetResearchContextDTO = z.infer<typeof GetResearchContextDTOSchema>;


export const ListResearchContextDTOSchema = DTOSchemaFactory(
    z.array(
        // GetResearchContextDTOSchema
        ResearchContextSchema.merge(z.object({
            message: z.string().optional(),
            context: z.any().optional(),
        }))
    ), BaseErrorDTOSchema);
export type TListResearchContextDTO = z.infer<typeof ListResearchContextDTOSchema>;

export const CreateResearchContextDTOSchema = DTOSchemaFactory(
    ResearchContextSchema,
    BaseErrorDTOSchema
);
export type TCreateResearchContextDTO = z.infer<typeof CreateResearchContextDTOSchema>;