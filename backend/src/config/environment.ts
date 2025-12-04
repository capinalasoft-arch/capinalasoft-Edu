import { ZodError, z } from 'zod';

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  API_PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  API_GLOBAL_PREFIX: z.string().min(1).default('api'),
  API_ENABLE_SHUTDOWN_HOOKS: z.coerce.boolean().default(true),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>;

export const validateEnvironment = (
  config: Record<string, unknown>,
): EnvironmentVariables => {
  try {
    return environmentSchema.parse(config);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('\n');

      throw new Error(`Invalid environment configuration:\n${formattedErrors}`);
    }

    throw error;
  }
};
