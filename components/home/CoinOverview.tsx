import {fetcher} from "@/lib/coingecko.actions";
import {formatCurrency} from "@/lib/utils";
import Image from 'next/image'

const CoinOverview = async () => {
    const coin = await fetcher<CoinDetailsData>("/coins/bitcoin", {
        dex_pair_format: "symbol",
    });

    return (
        <div id="coin-overview">
            <div className="headerv pt-2">
                <Image
                    src={coin.image.large}
                    alt={coin.name}
                    width={56}
                    height={56}
                />

                <div className="info">
                    <p>
                        {coin.name} / {coin.symbol.toUpperCase()}
                    </p>

                    <h2>
                        {formatCurrency(
                            coin.market_data.current_price.inr,
                            2,
                            "INR"
                        )}
                    </h2>
                </div>
            </div>
        </div>
    )
}
export default CoinOverview
