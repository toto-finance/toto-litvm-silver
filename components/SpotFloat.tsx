"use client";

import { usd } from "@/lib/format";
import { useOunceSpot } from "@/lib/silver";

export function SpotFloat() {
  const spot = useOunceSpot();
  const price = spot == null ? "—" : usd(spot);

  return (
    <aside className="spot-float" aria-label={`Silver ${price} per troy ounce`}>
      <p className="spot-price">{price}</p>
      <p className="spot-unit">/ oz</p>
    </aside>
  );
}
