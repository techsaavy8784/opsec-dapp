import { NextAdmin } from "@premieroctet/next-admin"
import { getPropsFromParams } from "@premieroctet/next-admin/dist/appRouter"
import prisma from "@/prisma"
import schema from "@/prisma/json-schema/json-schema.json"
import { submitFormAction } from "./actions"
import options from "./options"
import "@premieroctet/next-admin/dist/styles.css"

interface AdminPageProps {
  params: Record<string, string[]>
  searchParams?: Record<string, string | string[] | undefined>
}

async function AdminPage({
  params,
  searchParams,
}: {
  params: { [key: string]: string[] }
  searchParams: { [key: string]: string | string[] | undefined } | undefined
}) {
  const props = await getPropsFromParams({
    params: params.nextadmin,
    searchParams,
    prisma,
    schema,
    action: submitFormAction,
    options,
  })

  return <NextAdmin {...props} />
}

export default AdminPage
