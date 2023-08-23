import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { basicMethod } from "./index";
import { BigNumber } from "ethers";

describe("ERC721 Contract", () => {
  it("Should check Name ", async () => {
    const { deployer, token } = await loadFixture(basicMethod);
    expect(await token.name()).to.equal("Mint NFT");
  });

  it("Should check Symbol ", async () => {
    const { deployer, token } = await loadFixture(basicMethod);
    expect(await token.symbol()).to.equal("NFT");
  });

  it("Should check token URI ", async () => {
    const {  token,users, tokenURI1 } = await loadFixture(basicMethod);
    await token.mint(users[1].address, tokenURI1)
    expect(await token.tokenURI(1)).to.equal(tokenURI1);
  });

  it("Should check NFT Owner", async () => {
    const {  token,users, tokenURI1 } = await loadFixture(basicMethod);
    await token.mint(users[1].address, tokenURI1)
    expect(await token.ownerOf(1)).to.equal(users[1].address);
  });

  it("Should check Contract Owner", async () => {
    const { deployer, token } = await loadFixture(basicMethod);
    expect(await token.owner()).to.equal(deployer.address);
  });

  it("Should check NFT OWner Balance", async () => {
    const {  token,users, tokenURI1, tokenURI2 } = await loadFixture(basicMethod);
    await token.mint(users[1].address, tokenURI1)
    await token.mint(users[1].address, tokenURI2)
    expect(await token.balanceOf(users[1].address)).to.equal(BigNumber.from(2));
  });
   
});