import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "h-9 px-3": size === "sm",
          "h-10 px-4 py-2": size === "default",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

const ThemedButton = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  theme,
  ...props 
}, ref) => {
  const variants = {
    default: `${theme?.accent || 'bg-primary'} ${theme?.accentHover || 'hover:bg-primary/90'} text-white`,
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: `border ${theme?.border || 'border-input'} ${theme?.bgPrimary || 'bg-background'} shadow-sm ${theme?.buttonHover || 'hover:bg-accent'} ${theme?.text || 'text-foreground'}`,
    secondary: `${theme?.bgSecondary || 'bg-secondary'} ${theme?.text || 'text-secondary-foreground'} shadow-sm hover:bg-secondary/80`,
    ghost: `${theme?.buttonHover || 'hover:bg-accent'} ${theme?.text || 'text-foreground'}`,
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
ThemedButton.displayName = "ThemedButton";

export { Button, ThemedButton };