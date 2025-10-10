import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };

export * from "./button";
export * from "./card";
export * from "./input";
export * from "./label";
export * from "./separator";
export * from "./radio-group";
export * from "./form";
