import { CovalentClient } from "@covalenthq/client-sdk"

const client = new CovalentClient(
  process.env.NEXT_PUBLIC_COVALENT_API_KEY as string,
)

export default client
