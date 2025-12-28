import {z} from "zod";

const user_length_min_name = 10;
const user_role = Object.freeze(["Student", "Admin"]);
const user_minpass = 8;

export const User_register = z.object({
    name: z.string("nama harus berupa string").min(user_length_min_name, `jumlah nama minimal adalah ${user_length_min_name}`),
    email: z.email("email tidak valid"),
    password: z.string().min(user_minpass,`password minimal berisi ${user_minpass} digit`),
    role: z.enum(user_role).optional()
});

export const User_login = z.object({
    name: z.string("nama harus berupa string").min(user_length_min_name, `jumlah nama minimal adalah ${user_length_min_name}`).optional(),
    email: z.email("email tidak valid"),
    password: z.string().min(user_minpass,`password minimal berisi ${user_minpass} digit`),
});

export const Course = z.object({
    name: z.string("nama harus berupa string").nonempty("nama tidak boleh kosong")
});

export const Enrollment = z.object({
    userId: z.number().nonnegative("id tidak boleh negatif"),
    courseId: z.number().nonnegative("id tidak boleh negatif"),
});

export const flaterr = z.flattenError;