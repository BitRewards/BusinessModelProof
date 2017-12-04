# BitRewards Token (BIT) Growth Estimation
This repository contains calculations of projected BIT / ETH growth rate.
# Problem
We estimate BIT token price changes in 5 years timespan.
# Introduction
We use simulation-based approach to estimate BIT token price. 

In real world, BIT token price would be set by its price on leading cryptocurrency exchanges (like Bitfinex, HitBTC, YObit, Bittrex, etc.).

It's impossible to fully reproduce real exchange, as it's influenced by lots of factors.

So we simulate exchange using Bancor Formula™, which is developed by leading experts in finances [1] and widely supported by community [2].
# Model Actors
Our simulation consists of several entites, which are taking part in BIT/ETH tokens exchange:
1. **Shops**. They reward Users with BIT tokens. To get BIT tokens, they go to Exchange and buy BIT tokens for ETH.
2. **Users**. They receive BIT tokens from shops as a rewards for their purchases and other actions. They either give BIT tokens back to shop to get a discounts, or sell them at the Exchange, getting ETH. 
3. **Exchange**. It allowes Users and Shops to exchange BIT to ETH and vice versa. The prices on exchange are set by supply and demand levels.

# Input Data
- Total BIT emission will be 2 000 000 000 tokens
- 64% of BIT tokens will be distributed through ICO
- Initial BIT price is 0.00003472222222 ETH
- We put 220 ETH as an Ethereum Reserve on Bancor Exchanger Smart Contract
- We put 4200 ETH (as an Min Price Ethereum Reserve on Bancor Exchanger Smart Contract
- Bancor Exchanger CRR (Constant Reserve Ratio) is 1%, as recommended by Bancor [3]

# Assumptions List (pessimistic)
- BitRewards will collect $5'000'000 during ICO
- BitRewards signs up new shops according to the [financial plan](https://docs.google.com/spreadsheets/d/1mLkfOtFcDz6xIWLQcF2RjTXWn_YvVjMDeKPD8ED2j4Y/edit#gid=1468016542).
  - This is a pessimistic plan. We work hard on signing up new shops, so the numbers will be higher. Higher number of shops will drive BIT price up.
- Users sell 100% of BIT tokens they receive on the Exchange.
    - In real life, 100% would never be reached [4], as people forget about BIT and use it for other purposes, not only purchasing ETH for BIT (i.e. returning it to shop by getting discounts for BIT).
    - Number lower then 100% will drive the price of BIT up.
- Users sell tokens as follows:
  - In "Normal" Mode
	  - 50% of users who receive BIT token as a reward sell it immediately.
	  - Other 50% of tokens is sold during 2-year period: 5% in first month, 4% in second month, 3% in third month and 2% in the rest of monthes, excluding two last monthes (23th and 24th), which contain 1% each.
  - In "Sell100" Mode:
    - 100% of users who receive BIT token as a reward sell it immediately.
- For simplicity, ETH exchange rate does not change during simulation and equals to 300 USD for 1 ETH.
    - In real life, ETH/USD exchange rate is not fixed.
    - If ETH/USD rate goes up, it drives BIT/USD exchange rate up.
    - If ETH/USD rate goes down, it may temporary drive a BIT/USD exchange rate down. 
    - A part of our product development plan is becoming less dependent of ETH exchange rate by making use of Bancor Multiple Reserve CUrrencies.
# Assumptions Summary 
We use the *worst possible* market conditions and the *worst possible* user behaviour.

# How To Run Simulation
To start simulation, install latest NodeJS and run ```node app.js```.
This command will output the text report.
A copy of that report is available ```results.txt``` file in this repository.

# Simulation Results Explained
Given the preconditions stated above, the simulation shows the following:
1. Token growth rate will be 482% after 12 months, 2457% after 24 months, 6265% after 36 months, 11756% after 48 months and 20434% after 60 months.
2. Additionally, ETH Reserve on Bancor Exchanger Smart Contract will grow significally. It would be 1156 ETH after 12 months, 5552 ETH after 24 monhts, 14193 ETH after 36 months, 27219 ETH after 48 months and 48386 ETH (roughly $15 mln) after 60 months.
    - BitRewards team may use these funds to stabilize BIT exchange rate in case of market volatility.

# Charts

**More charts available [here](https://docs.google.com/spreadsheets/d/1gxdt9n0BOhuAK5Gnx0kIasIeDJxydE-k8ewzahW7rlQ/edit?usp=sharing).**

![BIT buy / BIT sell over time](/charts/bit_buy_vs_bit_sell.png)
![Merchans using BitRewards / BIT growth rate](/charts/merchants_count_vs_bit_growth.png)
![BitRewards Bancor Exchanger ETH reserve over time](/charts/exchanger_eth_reserve.png)

# References
1. [Bancor Protocol Description](https://www.bancor.network/about)
2. [Bancor Token Allocation Results](https://www.bancor.network/fundraiser)
3. [Bancor Token Creation Terms](https://medium.com/@bancor/bancor-network-token-bnt-contribution-token-creation-terms-48cc85a63812)
4. [Loyalty Metrics Program Performance](https://blog.smile.io/loyalty-metrics-program-performance)
5. [BitRewards Projected Financials](https://docs.google.com/spreadsheets/d/1mLkfOtFcDz6xIWLQcF2RjTXWn_YvVjMDeKPD8ED2j4Y/edit#gid=1468016542)
6. [Bancor Formula Proof](https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view)

# Authors 
Alexander Nevidimov. *CTO of BitRewards, CTO of GIFTD, ACM-ICPC contests winner, ex-team lead in one of the leading Bitcoin mining pools.*