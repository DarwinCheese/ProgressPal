import pkg from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const { PrismaClient } = pkg as any;

export const prisma = new PrismaClient().$extends(withAccelerate());