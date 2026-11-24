import Image from "next/image";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <Image
          className="logo"
          src="/logo.png"
          alt="Toto Finance"
          width={486}
          height={187}
        />
        <p className="footer-tagline">Building the Future of Global Trade</p>
        <p className="footer-about">
          Toto Finance is an asset-backed tokenization platform that provides
          digital infrastructure for tokenized commodities, enabling instant
          settlement and compliant global trade across metals, energy, and
          real-world assets.
        </p>
        <p className="footer-note">
          © 2026 Toto Finance. A purchase sends zkLTC on LitVM LiteForge.
          Prices are illustrative.
        </p>
        <section className="footer-disclaimer" aria-labelledby="footer-disclaimer">
          <h2 id="footer-disclaimer">Disclaimer</h2>
          <p>
            This website and its contents are provided by Toto Finance Inc., a Delaware
            corporation (“Toto Finance”), for general informational purposes only.
            Information regarding Toto Finance, its technology, digital assets,
            tokenization initiatives, commodities, products, services, business plans
            and potential future offerings is subject to change and may relate to
            products or services that are under development, not yet available, or
            available only to eligible persons in certain jurisdictions.
          </p>
          <p>
            Nothing on this website constitutes an offer to sell or a solicitation of
            an offer to buy any security, digital asset, commodity, financial
            instrument or other investment product, nor does it constitute investment,
            legal, tax, accounting, financial or other professional advice. No
            information on this website should be relied upon as a recommendation to
            acquire, sell, hold or transact in any digital asset or other asset. Any
            offer, if made, will be made only through applicable definitive
            documentation and in accordance with applicable law.
          </p>
          <p>
            Digital assets, blockchain-based products and commodities involve
            significant risks, including price volatility, loss of value, limited
            liquidity, technological and smart-contract risks, cybersecurity risks,
            regulatory uncertainty and potential total loss. Past performance, market
            prices, projections and forward-looking information are not indicative of
            future results. Digital assets are not bank deposits and are not insured
            by the FDIC, SIPC or any other governmental insurance program unless
            expressly stated otherwise.
          </p>
          <p>
            Access to certain products, digital assets, protocols or services may be
            restricted or prohibited in certain jurisdictions. You are solely
            responsible for determining whether your access, acquisition, holding,
            transfer or use of any digital asset, product or service is lawful in
            your jurisdiction and for obtaining appropriate independent professional
            advice.
          </p>
          <p>
            This website may contain links to or information concerning independent
            third-party websites, decentralized protocols, blockchain networks,
            wallets, exchanges, liquidity pools and other services, including
            Uniswap. Toto Finance does not own, operate or control such third-party
            protocols or services merely by linking to them. A link does not
            constitute an endorsement, recommendation or guarantee. Transactions
            conducted through third-party or decentralized protocols are undertaken
            directly by users at their own risk and are subject to the applicable
            protocol, smart contracts and third-party terms.
          </p>
          <p>
            Statements regarding Toto Finance&apos;s plans, objectives, anticipated
            products, tokenization initiatives, market opportunities, financing,
            partnerships, operations or future performance may constitute
            forward-looking statements. Such statements are based on current
            expectations and assumptions and are subject to risks and uncertainties
            that could cause actual developments or results to differ materially.
            Toto Finance undertakes no obligation to update forward-looking
            statements except as required by applicable law.
          </p>
          <p>
            The information on this website is provided “as is” and “as available”
            without representation or warranty, express or implied, regarding its
            accuracy, completeness, reliability or suitability. To the fullest extent
            permitted by law, Toto Finance and its affiliates, directors, officers,
            employees, advisors, agents and representatives disclaim liability for
            losses or damages arising from reliance on this website, use of
            third-party services or transactions involving digital assets.
          </p>
          <p>
            Additional terms, risk disclosures and restrictions may apply to specific
            products, services or digital assets.
          </p>
        </section>
      </div>
    </footer>
  );
}
