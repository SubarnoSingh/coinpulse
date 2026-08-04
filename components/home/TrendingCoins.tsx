import { fetcher } from "@/lib/coingecko.actions";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import DataTable from "@/components/DataTable";

type CoinPrices = Record<
  string,
  {
    inr?: number;
    inr_24h_change?: number;
  }
>;

const TrendingCoins = async () => {
  const trendingData = await fetcher<{ coins: TrendingCoin[] }>(
    "search/trending",
    undefined,
    300,
  );

  const trendingCoins = trendingData.coins.slice(0, 6);

  const coinIds = trendingCoins.map((coin) => coin.item.id).join(",");

  const prices = await fetcher<CoinPrices>(
    "simple/price",
    {
      ids: coinIds,
      vs_currencies: "inr",
      include_24hr_change: true,
    },
    300,
  );

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: ({ item }) => (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      ),
    },
    {
      header: "24h change",
      cellClassName: "change-cell",
      cell: ({ item }) => {
        const change =
          prices[item.id]?.inr_24h_change ??
          item.data.price_change_percentage_24h.usd;

        if (change == null) {
          return <span>—</span>;
        }

        const isTrendingUp = change >= 0;

        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            {isTrendingUp ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}

            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: ({ item }) => {
        const price = prices[item.id]?.inr;

        return price != null ? formatCurrency(price, 2, "INR") : "—";
      },
    },
  ];

  return (
    <div className="trending-coins">
      <p>Trending Coins</p>

      <div id="trending-coins">
        <DataTable
          data={trendingCoins}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
          headerCellClassName={"py-3!"}
          bodyCellClassName={"py-2!"}
        />
      </div>
    </div>
  );
};

export default TrendingCoins;
