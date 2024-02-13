import { NextAdminOptions } from "@premieroctet/next-admin"

const options: NextAdminOptions = {
  basePath: "/admin",
  model: {
    Blockchain: {
      edit: {
        display: [
          "id",
          "name",
          "url",
          "description",
          "price",
          "hasWallet",
          "launchedAt",
        ],
      },
    },
    Server: {
      edit: {
        display: ["id", "ssh", "command", "active", "blockchain"],
      },
    },
    User: {},
    Node: {
      edit: {
        display: ["id", "wallet"],
      },
    },
  },
}

export default options
