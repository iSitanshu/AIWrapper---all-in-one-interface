import { number, z } from "zod";

const MAX_INPUT_TOKENS = 1000;
export const SUPPORTER_MODELS = ["openai/gpt-4o" , "openai/gpt-5"];
export type MODEL = typeof SUPPORTER_MODELS[number];

export const CreateChatSchema = z.object({
    conversationId: z.uuid().optional(),
    message: z.string().max(MAX_INPUT_TOKENS),
    model: z.enum(SUPPORTER_MODELS)
})

export const CreateUser = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(7)
})

export const SignIn = z.object({
    email: z.email(),
    otp: z.string()
})

export const Login = z.object({
    email: z.email(),
    password: z.string().min(7)
})

export type Message = {
    content: string,
    role: Role
}

export type Messages = Message[];

export enum Role {
    Agent = "assistant",
    User = "user"
}