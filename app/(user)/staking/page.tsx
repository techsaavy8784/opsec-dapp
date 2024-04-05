import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StakingHistory from "./history"
import Staking from "./staking"
import StakingProgress from "./progress"
import ClaimF from "./claim"

const StakingPage: React.FC = () => (
  <>
    <Tabs defaultValue="staking">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="staking">Staking</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="staking">
        <div className="mt-8">
          <StakingProgress />
          <p className="mt-24">Stake to get reward</p>
          <hr className="my-4" />
          <Staking />
        </div>
      </TabsContent>
      <TabsContent value="history">
        <StakingHistory />
      </TabsContent>
    </Tabs>
    <ClaimF />
   </>
)

export default StakingPage
