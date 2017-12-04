"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Exchanger = (function () {
    function Exchanger(ethReserve, tokenCirculatingSupply, minPrice, minPriceEthReserve) {
        this.ethReserve = ethReserve;
        this.tokenCirculatingSupply = tokenCirculatingSupply;
        this.minPrice = minPrice;
        this.minPriceEthReserve = minPriceEthReserve;
    }
    Exchanger.ethToUsd = function (ethAmount) {
        return Math.round(ethAmount * Exchanger.ETH_EXCHANGE_RATE);
    };
    Exchanger.usdToEth = function (usdAmount) {
        return usdAmount / Exchanger.ETH_EXCHANGE_RATE;
    };
    /**
     * Bancor Formula
     * @see https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view
     */
    Exchanger.prototype.buyTokensByEtherAmount = function (ethAmount) {
        var bitAmount = this.tokenCirculatingSupply * (Math.pow((1 + ethAmount / this.ethReserve), Exchanger.TOKEN_RESERVE_RATIO) - 1);
        this.ethReserve += ethAmount;
        this.tokenCirculatingSupply += bitAmount;
        return bitAmount;
    };
    Exchanger.prototype.getEffectiveBuyPrice = function (bitAmount) {
        var ethAmount = this.ethReserve * (Math.pow(1 + bitAmount / this.tokenCirculatingSupply, 1 / Exchanger.TOKEN_RESERVE_RATIO) - 1);
        return ethAmount / bitAmount;
    };
    Exchanger.prototype.getEffectiveSellPrice = function (bitAmount) {
        return this.getEffectiveBuyPrice(-bitAmount);
    };
    /**
     * Bancor Formula
     * @see https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view
     */
    Exchanger.prototype.buyTokensByTokenAmount = function (bitAmount) {
        var ethAmount = this.ethReserve * (Math.pow(1 + bitAmount / this.tokenCirculatingSupply, 1 / Exchanger.TOKEN_RESERVE_RATIO) - 1);
        this.ethReserve += ethAmount;
        this.tokenCirculatingSupply += bitAmount;
        return ethAmount;
    };
    Exchanger.prototype.sellTokens = function (bitAmount) {
        if (this.minPrice) {
            var originalBitAmount = bitAmount, effectivePrice = void 0;
            var lower = 0, higher = bitAmount;
            while ((effectivePrice = this.getEffectiveSellPrice(bitAmount)) < this.minPrice) {
                bitAmount = (lower + higher) / 2;
                if (bitAmount == 0) {
                    break;
                }
                effectivePrice = this.getEffectiveSellPrice(bitAmount);
                if (effectivePrice < this.minPrice) {
                    higher = bitAmount;
                }
                else {
                    lower = bitAmount;
                }
            }
            var ethFromMinPriceReserve = (originalBitAmount - bitAmount) * this.minPrice;
            if (ethFromMinPriceReserve > this.minPriceEthReserve) {
                var unpayableBitAmount = (ethFromMinPriceReserve - this.minPriceEthReserve) / this.minPrice;
                bitAmount += unpayableBitAmount;
                ethFromMinPriceReserve = this.minPriceEthReserve;
            }
            var ethAmount = Math.abs(this.buyTokensByTokenAmount(-bitAmount));
            ethAmount += ethFromMinPriceReserve;
            this.minPriceEthReserve -= ethFromMinPriceReserve;
            return Math.abs(ethAmount);
        }
        else {
            var ethAmount = this.buyTokensByTokenAmount(-bitAmount);
            return Math.abs(ethAmount);
        }
    };
    Exchanger.prototype.getCurrentTokenPrice = function () {
        return this.ethReserve / (this.tokenCirculatingSupply * Exchanger.TOKEN_RESERVE_RATIO);
    };
    Exchanger.prototype.getEthReserve = function () {
        return this.ethReserve;
    };
    Exchanger.prototype.getTotalEthReserve = function () {
        return this.ethReserve + this.minPriceEthReserve;
    };
    /**
     * 10% reserve ratio chosen according to Bancor's own choice
     * @see https://medium.com/@bancor/bancor-network-token-bnt-contribution-token-creation-terms-48cc85a63812
     */
    Exchanger.TOKEN_RESERVE_RATIO = 0.01;
    /**
     * For simplicity we assume that ETH price does not change
     */
    Exchanger.ETH_EXCHANGE_RATE = 300;
    return Exchanger;
}());
exports.Exchanger = Exchanger;
