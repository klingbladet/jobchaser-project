import { z } from 'zod';

export const SignupSchema = z.object({
  username: z.string().min(3, "Användarnamnet måste vara minst 3 tecken").max(50, "Användarnamnet får vara max 50 tecken"),
  email: z.string().email("Ogiltig e-postadress").max(255),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
});

export const LoginSchema = z.object({
  username: z.string().min(1, "Användarnamn krävs"),
  password: z.string().min(1, "Lösenord krävs"),
});

export const JobSchema = z.object({
  headline: z.string().min(1, "Jobbtitel krävs"),
  employerName: z.string().min(1, "Arbetsgivare krävs"),
  municipality: z.string().optional(),
  descriptionText: z.string().optional(),
  workingHoursLabel: z.string().optional(),
  durationLabel: z.string().optional(),
  webpageUrl: z.string().url("Ogiltig URL").optional().or(z.literal("")),
});

export const PartialJobSchema = JobSchema.partial();
