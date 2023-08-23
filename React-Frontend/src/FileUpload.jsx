import { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [transactionHash, settransactionHash] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        // eslint-disable-next-line no-unused-vars
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setCid(data.cid);
            settransactionHash(data.transactionHash);

            console.log(data.cid);
            console.log(data.transactionHash);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        alert("No file Selected!");
      }
    } catch (error) {
      alert(error);
    }
  };

  const retreiveFile = (event) => {
    try {
      const data = event.target.files[0];
      setFile(data);
      event.preventDefault();
    } catch {
      alert("File not retreive");
    }
  };

  return (
    <>
      {" "}
      <div className="img-ctr">
        {cid && (
          <a href={`https://${cid}.ipfs.dweb.link`}>
            <img src={`https://${cid}.ipfs.dweb.link`} height={"250px"} />
          </a>
        )}
      </div>
      <div className="transaction">
        {transactionHash && (
          <a href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}>
            Transaction Detials
          </a>
        )}
      </div>{" "}
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            className="choose"
            name="image"
            onChange={retreiveFile}
          />
          <button className="btn" type="submit">
            Mint NFT
          </button>
        </form>
      </div>
    </>
  );
};

export default FileUpload;
