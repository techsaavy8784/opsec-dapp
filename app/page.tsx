import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
  return (
    <div>
      <h1>Redirecting to dashboard</h1>
    </div>
  )
}
