"use strict";
function loadingAbout() {
    let aboutElement = document.createElement('svg');
    aboutElement.innerHTML = `<div class="about-container">

  <div class="about-heading">
  <h1 >About us</h1>
  <h2></h2>
  <p>We're the most trusted place for people and businesses to buy, sell, and manage crypto.</p>
</div>
<div class="about-container"><section class= 'about-section'>
  <div class="about-img">
    <img src="pics/crypto.jpg" alt="" />
  </div>
  <div class="about-content">
  <h2>The future of money is here</h2>
  <p>
    Explore crypto like Bitcoin, Ethereum, and Dogecoin. Simply and securely buy, sell, and manage hundreds of
    cryptocurrencies. Powerful tools, designed for the advanced trader Powerful analytical tools with the
    safety and security of Cryptonite deliver the ultimate trading experience. Tap into sophisticated charting
    capabilities, real-time order books, and deep liquidity across hundreds of markets.
  </p>
 
</div>
</section>
</div>
<div class='about-container'>
<section class= 'about-section'>
<div class="about-img">
  <img src="pics/theCeo.jpg" alt="">
</div>
<div class="about-content">
<h2>The CEO</h2 >
<p>
  Lior Trosman is the founder, chairman and CEO of Cryptonite. He is responsible for creating and building the websites and apps, setting the overall
  direction and product strategy for the company.
  <p> “We’re a company where everyone here wakes up in the
    morning and thinks about how we’re going to help our customers make more money.” </p>
  </p>
  <p>(Interview with The Verge, FEB.
    2024)</p>
  </div>
  </section>
  </div>
`;
    return aboutElement;
}
