import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StakingHistory from "./history"
import Staking from "./staking"

const StakingPage: React.FC = () => (
  <Tabs defaultValue="staking">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="staking">Staking</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
    </TabsList>
    <TabsContent value="staking">
      <Staking />
    </TabsContent>
    <TabsContent value="history">
      <StakingHistory />
    </TabsContent>
  </Tabs>
)

export default StakingPage
