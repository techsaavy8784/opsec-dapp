import { NextAdminOptions } from "@premieroctet/next-admin"

const options: NextAdminOptions = {
  basePath: "/manage",
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
        display: ["id", "host", "port", "username", "password", "active"],
      },
      list: {
        display: ["id", "host", "port", "username", "password", "active"],
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
