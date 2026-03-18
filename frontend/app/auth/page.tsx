import { AuthBackground } from "@/components/auth/auth-background"
import { AuthBrandingPanel } from "@/components/auth/auth-branding"
import { AuthFormUnified } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      <AuthBackground />
      <AuthBrandingPanel />
      <AuthFormUnified />
    </div>
  )
}
