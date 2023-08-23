import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export async function basicMethod() {

  const tokenURI1 = "https://gateway.pinata.cloud/ipfs/QmZcKiS2LA5xjnnAg6HDoAe7fzhVwbv8n41wimNLrMSTGH";
  const tokenURI2 = "https://gateway.pinata.cloud/ipfs/QmZf98ZsqPxsUSaTcsPd1i7yEJo5ZgSCzp7YtkhnyGxg31";
  // random address
  const [deployer, ...users] = await ethers.getSigners();

  // Deploy Token Contract
  const Token = await ethers.getContractFactory("ERC721Token");
  const token = await Token.deploy();

  return {
    deployer,
    users,
    token,
    tokenURI1,
    tokenURI2
  };
}

// conver value into Big Number 1^18 or 1e18
function decimal(value: any) {
  const powValue = BigNumber.from("10").pow(18);
  return BigNumber.from(value).mul(powValue);
}