import { z } from 'zod';

/**
 * Creates a discriminated union schema for DTOs.
 *
 * @template TSuccessData - The type of the success data.
 * @template TErrorData - The type of the error data.
 * @param {z.Schema<TSuccessData>} successDataSchema - The schema for the success data.
 * @param {z.Schema<TErrorData>} errorTypes - The schema for the error types.
 * @returns {z.Schema<TSuccessData | TErrorData>} - The discriminated union schema for DTOs.
 */
export const DTOSchemaFactory = <TSuccessData, TErrorData>(
    successDataSchema: z.Schema<TSuccessData>,
    errorTypes: z.Schema<TErrorData>,
) => {
    return z.discriminatedUnion("success", [
        z.object({
            success: z.literal(true),
            data: successDataSchema,
        }),
        z.object({
            success: z.literal(false),
            data: errorTypes,
        }),
    ]);
};

export type BaseDTO<TSuccessData, TErrorData> = z.infer<
    ReturnType<typeof DTOSchemaFactory<TSuccessData, TErrorData>>
>;


/**
 * Defines the schema for the BaseErrorDTO object.
 */
export const BaseErrorDTOSchema = z.object({
    operation: z.string(),
    message: z.string(),
});

export type TBaseErrorDTOData = z.infer<typeof BaseErrorDTOSchema>;
