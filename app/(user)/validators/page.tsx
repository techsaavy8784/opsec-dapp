import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Purchase from "./purchase"
import ViewValidatorStatus from "./show/view"
import Claim from "./claim"
import { ValidatorNodeFilter } from "@/lib/constants"

const Validators = () => (
  <Tabs defaultValue="runnig">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="runnig">Running Validator</TabsTrigger>
      <TabsTrigger value="pending">Pending Validator</TabsTrigger>
      <TabsTrigger value="purchase">Purchase Validator Nodes</TabsTrigger>
      <TabsTrigger value="claim">Claim Rewards</TabsTrigger>
    </TabsList>
    <TabsContent value="runnig">
      <ViewValidatorStatus status={ValidatorNodeFilter.FULLY_PURCHASED_NODES} />
    </TabsContent>
    <TabsContent value="pending">
      <ViewValidatorStatus
        status={ValidatorNodeFilter.PARTIALLY_PURCHASED_NODES}
      />
    </TabsContent>
    <TabsContent value="purchase">
      <Purchase />
    </TabsContent>
    <TabsContent value="claim">
      <Claim />
    </TabsContent>
  </Tabs>
)

export default Validators
