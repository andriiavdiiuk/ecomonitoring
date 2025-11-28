import { z } from 'zod'

export const healthRiskOptionsSchema = z.object({
    C: z.number().gte(0).optional(),
    IR: z.number().gt(0).optional(),
    EF: z.number().gt(0).optional(),
    ED: z.number().gt(0).optional(),
    BW: z.number().gt(0).optional(),
    AT: z.number().gte(0).optional(),
    RFC: z.number().gte(0).optional(),
    SF: z.number().gte(0).optional(),
})
export type HealthRiskOptionsDto = z.infer<typeof healthRiskOptionsSchema>;