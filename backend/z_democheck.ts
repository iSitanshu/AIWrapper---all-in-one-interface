import { z } from "zod";

const userProfile = z.object({
    username: z.string().min(3, "Username should be at least 3 long"),
    email: z.email('Invalid Email format'),
    age: z.number().int().positive("Age must be positive").optional(),
    roles: z.array(z.enum(["A","B"])).default(["A"]),
});

const validUser = {
    username: "Sitanshu",
    email: "1@1.com"
}

const response = userProfile.safeParse(validUser)
console.log("Response from the ZOD Library = ",response);
// object containing success and data 