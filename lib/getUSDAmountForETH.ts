import axios from "axios"

async function getUSDAmountForETH(ethAmount: number) {
  try {
    // Make a GET request to the Coinbase API endpoint for the current ETH-USD spot price
    const response = await axios.get(
      "https://api.coinbase.com/v2/prices/ETH-USD/spot",
    )

    // Extract the USD spot price from the response
    const usdSpotPrice = response.data.data.amount * ethAmount

    return usdSpotPrice
  } catch (error) {
    console.error("Error fetching ETH-USD spot price:", error)
    throw error
  }
}

export default getUSDAmountForETH
