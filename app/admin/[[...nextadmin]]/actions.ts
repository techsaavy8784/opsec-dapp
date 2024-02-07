"use server"

import { ActionParams, NextAdminOptions } from "@premieroctet/next-admin"
import { submitForm } from "@premieroctet/next-admin/dist/actions"
import prisma from "@/prisma"

export const options: NextAdminOptions = {
  basePath: "/admin",
}

export const submitFormAction = async (
  params: ActionParams,
  formData: FormData,
) => {
  return submitForm({ ...params, options, prisma }, formData)
}
