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
    ValidatorType: {
      edit: {
        display: [
          "id",
          "name",
          "rewardLockTime",
          "rewardPerMonth",
          "price",
          "floorPrice",
          "priceUnit",
          "rewardWallet",
        ],
      },
      list: {
        display: [
          "id",
          "name",
          "rewardLockTime",
          "rewardPerMonth",
          "price",
          "floorPrice",
          "priceUnit",
          "rewardWallet",
        ],
      },
    },
    Validator: {
      edit: {
        display: ["id", "typeId", "serverId", "purchaseTime"],
      },
      list: {
        display: ["id", "typeId", "serverId", "purchaseTime"],
      },
    },
  },
}

export default options
