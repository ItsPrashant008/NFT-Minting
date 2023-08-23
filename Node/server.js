require("dotenv").config();
const express = require("express");
const app = express();

const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const port = process.env.PORT || 5000;

SMART_CONTRACT_NETWORK = "polygon-mumbai";
SMART_CONTRACT_ADDRESS = "0xeca4c26414b397372ffb2d7dce91c832e1b330cd";
WALLET_IMPORTED_ON_STARTON = "0x991c05eb63d7d68F305b9C39212524b7CafF4D50";
RECEIVER_ADDRESS = "0xFD926386D5afE5F787146B65130976E3ba1aAed9";

app.use(express.json());

const upload = multer({
  limit: {
    fileSize: 1000000,
  },
});

const starton = axios.create({
  baseURL: "https://api.starton.com/v3",
  headers: {
    "x-api-key": "sk_live_50e7ca45-112d-4dd7-8052-4867d3ce2674",
  },
});

app.get("/", (req, res) => {
  res.send("Server is Running");
  res.end();
});

app.post("/upload", cors(), upload.single("file"), async (req, res) => {
  let data = new FormData();
  const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
  data.append("file", blob, { filename: req.file.originalnam });
  data.append("isSync", "true");

  async function uploadImageOnIpfs() {
    const ipfsImg = await starton.post("/ipfs/file", data, {
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });
    return ipfsImg.data;
  }

  async function uploadMetaDataOnIpfs(ImgCid) {
    const metaDataJson = {
      name: `Mint NFT`,
      description: `Try to Mint NFTs`,
      image: `ipfs://ipfs/${ImgCid}`,
    };

    const ipfsMetaData = await starton.post("/ipfs/json", {
      name: "NFT MetaData",
      content: metaDataJson,
      isSync: true,
    });
    return ipfsMetaData.data;
  }

  async function mintNFT(receiverAddress, metadataCid) {
    const nft = await starton.post(
      `/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`,
      {
        functionName: "mint(address,string)",
        signerWallet: WALLET_IMPORTED_ON_STARTON,
        speed: "low",
        params: [receiverAddress, metadataCid],
      }
    );
    return nft.data;
  }

  const ipfsImgData = await uploadImageOnIpfs();
  const ipfsMetaData = await uploadMetaDataOnIpfs(ipfsImgData.cid);

  const nft = await mintNFT(RECEIVER_ADDRESS, ipfsMetaData.cid);
  console.log(nft);
  res.status(201).json({
    transactionHash: nft.transactionHash,
    cid: ipfsImgData.cid,
  });
});

app.listen(port, () => {
  console.log(`server is running on this url: http://localhost:${port}`);
});
