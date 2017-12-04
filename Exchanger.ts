export class Exchanger
{
    private ethReserve;
    private tokenCirculatingSupply;

    private minPrice;
    private minPriceEthReserve;

    /**
     * 10% reserve ratio chosen according to Bancor's own choice
     * @see https://medium.com/@bancor/bancor-network-token-bnt-contribution-token-creation-terms-48cc85a63812
     */
    public static TOKEN_RESERVE_RATIO = 0.01;

    /**
     * For simplicity we assume that ETH price does not change
     */
    private static ETH_EXCHANGE_RATE = 300;

    public constructor(ethReserve, tokenCirculatingSupply, minPrice, minPriceEthReserve)
    {
        this.ethReserve = ethReserve;
        this.tokenCirculatingSupply = tokenCirculatingSupply;
        this.minPrice = minPrice;
        this.minPriceEthReserve = minPriceEthReserve;
    }

    public static ethToUsd(ethAmount)
    {
        return Math.round(ethAmount * Exchanger.ETH_EXCHANGE_RATE);
    }

    public static usdToEth(usdAmount)
    {
        return usdAmount / Exchanger.ETH_EXCHANGE_RATE;
    }

    /**
     * Bancor Formula
     * @see https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view
     */
    public buyTokensByEtherAmount(ethAmount)
    {
        let bitAmount = this.tokenCirculatingSupply * (
            Math.pow((1 + ethAmount / this.ethReserve), Exchanger.TOKEN_RESERVE_RATIO) - 1
        );

        this.ethReserve += ethAmount;
        this.tokenCirculatingSupply += bitAmount;

        return bitAmount;
    }

    private getEffectiveBuyPrice(bitAmount)
    {
        let ethAmount = this.ethReserve * (
            Math.pow(1 + bitAmount / this.tokenCirculatingSupply, 1 / Exchanger.TOKEN_RESERVE_RATIO) - 1
        );

        return ethAmount / bitAmount;
    }

    private getEffectiveSellPrice(bitAmount)
    {
        return this.getEffectiveBuyPrice(-bitAmount);
    }

    /**
     * Bancor Formula
     * @see https://drive.google.com/file/d/0B3HPNP-GDn7aRkVaV3dkVl9NS2M/view
     */
    public buyTokensByTokenAmount(bitAmount) {
        let ethAmount = this.ethReserve * (
            Math.pow(1 + bitAmount / this.tokenCirculatingSupply, 1 / Exchanger.TOKEN_RESERVE_RATIO) - 1
        );

        this.ethReserve += ethAmount;
        this.tokenCirculatingSupply += bitAmount;

        return ethAmount;
    }

    public sellTokens(bitAmount) {
        if (this.minPrice) {
            let originalBitAmount = bitAmount, effectivePrice;
            let lower = 0, higher = bitAmount;
            while ((effectivePrice = this.getEffectiveSellPrice(bitAmount)) < this.minPrice) {
                bitAmount = (lower + higher) / 2;
                if (bitAmount == 0) {
                    break;
                }
                effectivePrice = this.getEffectiveSellPrice(bitAmount)
                if (effectivePrice < this.minPrice) {
                    higher = bitAmount;
                } else {
                    lower = bitAmount;
                }
            }

            let ethFromMinPriceReserve = (originalBitAmount - bitAmount) * this.minPrice;

            if (ethFromMinPriceReserve > this.minPriceEthReserve) {
                let unpayableBitAmount = (ethFromMinPriceReserve - this.minPriceEthReserve) / this.minPrice;
                bitAmount += unpayableBitAmount;
                ethFromMinPriceReserve = this.minPriceEthReserve;
            }

            let ethAmount = Math.abs(this.buyTokensByTokenAmount(-bitAmount));
            ethAmount += ethFromMinPriceReserve;

            this.minPriceEthReserve -= ethFromMinPriceReserve;

            return Math.abs(ethAmount);
        } else {
            let ethAmount = this.buyTokensByTokenAmount(-bitAmount);

            return Math.abs(ethAmount);
        }
    }

    public getCurrentTokenPrice()
    {
        return this.ethReserve / (this.tokenCirculatingSupply * Exchanger.TOKEN_RESERVE_RATIO);
    }

    public getEthReserve()
    {
        return this.ethReserve;
    }

    public getTotalEthReserve()
    {
        return this.ethReserve + this.minPriceEthReserve;
    }

}