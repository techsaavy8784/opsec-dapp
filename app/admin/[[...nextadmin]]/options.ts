import { NextAdminOptions } from "@premieroctet/next-admin"

const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    Blockchain: {
      edit: {
        display: ["id", "name", "url", "price", "launchedAt"],
      },
    },
    Server: {
      edit: {
        display: ["id", "ssh", "command", "active", "hasWallet", "blockchain"],
      },
    },
    User: {},
  },
}

export default options
