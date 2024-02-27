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
        display: [
          "id",
          "host",
          "port",
          "username",
          "password",
          "active",
          "blockchain",
        ],
        fields: {
          blockchain: {
            optionFormatter: (values) => values.name,
          },
        },
      },
      list: {
        display: [
          "id",
          "host",
          "port",
          "username",
          "password",
          "active",
          "blockchain",
        ],
        fields: {
          blockchain: {
            formatter: (chain) => chain.name,
          },
        },
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
