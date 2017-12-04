"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exchanger_1 = require("./Exchanger");
var Simulation = (function () {
    function Simulation() {
    }
    Simulation.prototype.run = function (mode) {
        var TOTAL_EMISSION = 2000000000; // as stated in BitRewards WhitePaper
        var TOTAL_ICO_DISTRIBUTION = TOTAL_EMISSION * 0.64; // as stated in BitRewards WhitePaper
        var TOTAL_ICO_SALE_TOKENS = 614400000; // roughly USD 5.3kk, https://docs.google.com/spreadsheets/d/1l1gE5nLQ4AoNyAnjgULpJrCPTot9_C9TxNWMzY94u-I/edit#gid=0
        var ICO_BASE_PRICE = 0.00003472222222; // https://docs.google.com/spreadsheets/d/1l1gE5nLQ4AoNyAnjgULpJrCPTot9_C9TxNWMzY94u-I/edit#gid=0
        var MIN_PRICE = ICO_BASE_PRICE; // Exchanger will do its best to forbid price drop below that level
        var MIN_PRICE_ETH_RESERVE = 4200; // we put roughly USD 1.3kk (4200 ETH) to enforce that price doesn't drop below MIN_PRICE
        /**
         * In this simulation we assume that max. 3% of token holders after ICO will sell it immediately.
         * However most probably we will restrict trading BIT on exchanges during 1-year period after ICO.
         * This would lead to lower number then 3%, and in its turn this would lead to greater price increasing.
         */
        var TOTAL_TOKENS_ON_MARKET_ON_START = TOTAL_ICO_SALE_TOKENS;
        /**
         * ETH amount that we put into Bancor Exchanger initially (1000 ETH ≈ $300'000).
         */
        var ETH_RESERVE_ON_EXCHANGER = TOTAL_TOKENS_ON_MARKET_ON_START * ICO_BASE_PRICE * Exchanger_1.Exchanger.TOKEN_RESERVE_RATIO;
        console.log("ETH Reserve on exchanger: " + ETH_RESERVE_ON_EXCHANGER + " ETH");
        var MONTHS_COUNT = 60;
        /**
         * According to BitRewards Financial Plan
         * 5 years projection (60 months)
         * @see https://docs.google.com/spreadsheets/d/1mLkfOtFcDz6xIWLQcF2RjTXWn_YvVjMDeKPD8ED2j4Y/edit#gid=1468016542
         */
        var TOKEN_MONTHLY_USD_ACQUISITION_BY_SHOPS = [
            1500, 2500, 5000, 10000, 24000, 40800, 62400, 89400, 120000, 153600, 190800, 232200, 324800, 385700, 450100, 518000, 590100, 667800, 859200, 962400, 1074400, 1196000, 1328800, 1472800, 1835100, 2019600, 2211300, 2411100, 2620800, 2840400, 3414000, 3686000, 3974000, 4280000, 4590000, 4906000, 5229000, 5560000, 5900000, 6251000, 6614000, 6990000, 8119100, 8566800, 9033200, 9519400, 10025400, 10554500, 11106700, 11684200, 12288100, 12920600, 13582800, 14276900, 16368000, 17199600, 18072000, 18986400, 19945200, 20950800
        ];
        var MONTHLY_SHOPS_COUNT = [
            3, 5, 10, 20, 40, 68, 104, 149, 200, 256, 318, 387, 464, 551, 643, 740, 843, 954, 1074, 1203, 1343, 1495, 1661, 1841, 2039, 2244, 2457, 2679, 2912, 3156, 3414, 3686, 3974, 4280, 4590, 4906, 5229, 5560, 5900, 6251, 6614, 6990, 7381, 7788, 8212, 8654, 9114, 9595, 10097, 10622, 11171, 11746, 12348, 12979, 13640, 14333, 15060, 15822, 16621, 17459
        ];
        /**
         * We assume that users will sell 80% of their tokens during 12 month period after receiving
         * 50% immediately after receiving, 20% in 1 month, 10% in 2 months, etc.
         *
         * In real life they will sell less then 70% because of lost tokens, forgotten tokens, etc.
         *
         * @see https://blog.smile.io/loyalty-metrics-program-performance
         */
        var TOKEN_USERS_SELL_DELAYED_FRACTIONS_BY_MONTH = mode == Simulation.MODE_SELL_100 ? [1] : [
            0.5, 0.05, 0.04, 0.03, 0.02, 0.02,
            0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
            0.02, 0.02, 0.02, 0.02, 0.02, 0.02,
            0.02, 0.02, 0.02, 0.02, 0.01, 0.01,
        ];
        // console.log(TOKEN_USERS_SELL_DELAYED_FRACTIONS_BY_MONTH.reduce((a, b) => {return a + b;}));
        /**
         * Exchanger works on Bancor formula
         * @see https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view
         */
        var exchanger = new Exchanger_1.Exchanger(ETH_RESERVE_ON_EXCHANGER, TOTAL_TOKENS_ON_MARKET_ON_START, MIN_PRICE, MIN_PRICE_ETH_RESERVE);
        var initialPrice = exchanger.getCurrentTokenPrice();
        console.log("Initial price: 1 BIT = " + initialPrice + " ETH");
        /**
         * History of BIT's amounts bought by shops for rewarding users each month
         */
        var bitAmountsHistory = [];
        var OUTPUT_FOR_CHARTS = true;
        if (OUTPUT_FOR_CHARTS) {
            console.log("Month #\tMerchants count\tBIT demand\tBIT supply\tEffective BIT price\tBIT growth %\tExchanger ETH reserve");
        }
        for (var i = 0; i < MONTHS_COUNT; i++) {
            if (!OUTPUT_FOR_CHARTS) {
                console.log("\n===MONTH " + (i + 1) + "===");
            }
            var usdBuyAmount = TOKEN_MONTHLY_USD_ACQUISITION_BY_SHOPS[i];
            var ethBuyAmount = Exchanger_1.Exchanger.usdToEth(usdBuyAmount);
            var bitBuyAmount = exchanger.buyTokensByEtherAmount(ethBuyAmount);
            var effectiveBitPrice = ethBuyAmount / bitBuyAmount;
            bitAmountsHistory.push(bitBuyAmount);
            var shopsCount = MONTHLY_SHOPS_COUNT[i];
            if (!OUTPUT_FOR_CHARTS) {
                console.log(shopsCount + " merchants buy " + bitBuyAmount.toFixed(2) + " BIT for " + ethBuyAmount.toFixed(2) + " ETH ($" + usdBuyAmount + "). Effective price: 1 BIT = " + effectiveBitPrice + " ETH");
            }
            var bitSellAmount = 0;
            for (var j = 0; j < TOKEN_USERS_SELL_DELAYED_FRACTIONS_BY_MONTH.length; j++) {
                var month = i - j;
                if (month < 0) {
                    break;
                }
                bitSellAmount += bitAmountsHistory[month] * TOKEN_USERS_SELL_DELAYED_FRACTIONS_BY_MONTH[j];
            }
            if (i == 1 && mode == Simulation.MODE_ICO_DROP_10) {
                bitSellAmount += 0.1 * TOTAL_TOKENS_ON_MARKET_ON_START;
            }
            if (i == 1 && mode == Simulation.MODE_ICO_DROP_20) {
                bitSellAmount += 0.2 * TOTAL_TOKENS_ON_MARKET_ON_START;
            }
            var ethSellAmount = exchanger.sellTokens(bitSellAmount);
            effectiveBitPrice = ethSellAmount / bitSellAmount;
            if (!OUTPUT_FOR_CHARTS) {
                console.log("Users sell " + bitSellAmount.toFixed(2) + " BIT for " + ethSellAmount.toFixed(2) + " ETH. Effective price: 1 BIT = " + effectiveBitPrice + " ETH");
                console.log("Exchanger reserve: " + exchanger.getTotalEthReserve().toFixed(2) + " ETH ($" + Exchanger_1.Exchanger.ethToUsd(exchanger.getTotalEthReserve()) + ")");
            }
            var growthPercentage = Math.round((effectiveBitPrice - initialPrice) / initialPrice * 100);
            if (!OUTPUT_FOR_CHARTS) {
                console.log("BIT growth percentage from beginning: " + growthPercentage + "%");
            }
            if (OUTPUT_FOR_CHARTS) {
                console.log(i + 1 + "\t" + shopsCount + "\t" + bitBuyAmount.toFixed(2) + "\t" + bitSellAmount.toFixed(2) + "\t" + effectiveBitPrice + "\t" + growthPercentage + "\t" + exchanger.getTotalEthReserve().toFixed(2));
            }
        }
    };
    Simulation.MODE_NORMAL = "normal";
    Simulation.MODE_ICO_DROP_10 = "icodrop10";
    Simulation.MODE_ICO_DROP_20 = "icodrop20";
    Simulation.MODE_SELL_100 = "sell100";
    return Simulation;
}());
exports.Simulation = Simulation;
