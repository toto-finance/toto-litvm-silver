"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/components/ShopProvider";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function Header() {
  const { count, session } = useShop();

  return (
    <header className="header">
      <a className="skip" href="#shelf">
        Skip to the shelf
      </a>
      <div className="wrap header-inner">
        <Link className="brand" href="/" aria-label="Toto Finance">
          <Image
            className="logo"
            src="/logo.png"
            alt=""
            width={486}
            height={187}
            priority
          />
        </Link>
        <nav className="nav" aria-label="Shop">
          <Link href="/#shelf">Shop</Link>
          <Link href="/account">Account</Link>
          <Link href="/cart">
            Cart
            <span className="count">{count}</span>
          </Link>
          {session ? (
            <Link href="/account">{shortAddress(session.address)}</Link>
          ) : (
            <Link className="nav-signin" href="/signin">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
