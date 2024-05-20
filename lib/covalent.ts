import { CovalentClient } from "@covalenthq/client-sdk"

export const covalentClient = new CovalentClient(
  process.env.NEXT_PUBLIC_COVALENT_API_KEY as string,
)
