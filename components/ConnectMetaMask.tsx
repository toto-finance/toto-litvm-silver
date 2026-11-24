"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function ConnectMetaMask() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        if (!mounted) {
          return (
            <button className="btn" type="button" disabled>
              Connect MetaMask
            </button>
          );
        }

        if (!account) {
          return (
            <button className="btn" type="button" onClick={openConnectModal}>
              Connect MetaMask
            </button>
          );
        }

        if (chain?.unsupported) {
          return (
            <button className="btn" type="button" onClick={openChainModal}>
              Switch network
            </button>
          );
        }

        return (
          <button className="btn btn-ghost" type="button" onClick={openAccountModal}>
            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
