"use client"

import * as React from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { Send, Trash2, Loader2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface BaseButtonProps extends Omit<HTMLMotionProps<"button">, "size" | "children"> {
    isLoading?: boolean
    icon?: React.ReactNode
    size?: "default" | "sm" | "lg" | "icon"
    children?: React.ReactNode
}

export const DeployButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, icon: customIcon, size = "default", children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative flex items-center justify-center gap-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
                    isLoading && "cursor-not-allowed opacity-90",
                    className
                )}
                {...props}
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Deploying...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Zap className="h-4 w-4" />
                            <span>{children || "Deploy Agent"}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        )
    }
)
DeployButton.displayName = "DeployButton"

export const SendButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, isLoading, icon: customIcon, size = "default", children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                    "flex items-center justify-center gap-2 rounded-lg font-medium transition-colors shadow-sm",
                    "bg-blue-600 hover:bg-blue-700 text-white",
                    size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm",
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Send className="h-3.5 w-3.5" />
                )}
                <span>{children || "Send"}</span>
            </motion.button>
        )
    }
)
SendButton.displayName = "SendButton"

export const ClearButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ className, size = "default", isLoading, icon: customIcon, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                    "flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
                    "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground",
                    size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm",
                    className
                )}
                {...props}
            >
                <Trash2 className="h-4 w-4" />
                <span>{children || "Clear"}</span>
            </motion.button>
        )
    }
)
ClearButton.displayName = "ClearButton"
