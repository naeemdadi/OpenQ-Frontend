import React, { useContext, useState } from "react";
import StoreContext from "../../../store/Store/StoreContext";
import Image from "next/image";

const TokenList = ({ onCurrencySelect, setShowTokenSearch }) => {
  const [appState] = useContext(StoreContext);
  const [tokenSearchTerm, setTokenSearchTerm] = useState(null);

  function onSelect(token) {
    onCurrencySelect(token);
    setShowTokenSearch(false);
  }
  return (
    <div>
      {/* <div style={{ padding: '25px', margin: '10px', outline: '2px solid pink', borderRadius: '20px' }} > */}
      <div className="pt-3 pb-3 pl-4 bg-slate-700 border border-web-gray bg-dark-mode rounded-lg">
        <div className="">
          <div className="justify-start bg-dark-mode ">
            <input
              className="outline-none bg-dark-mode text-white"
              onKeyUp={(e) => setTokenSearchTerm(e.target.value)}
              type="text"
              placeholder="Search name"
            ></input>
          </div>
        </div>
      </div>

      <div className="pt-4 text-white">
        {appState.tokens
          .filter((token) => {
            return tokenSearchTerm
              ? token.name
                  .toLowerCase()
                  .indexOf(tokenSearchTerm.toLowerCase()) > -1
              : token;
          })
          .map((token) => {
            return (
              <div className="justify-left items-center" key={token.address}>
                <div
                  className="flex flex-row cursor-pointer space-x-4 pb-3"
                  onClick={() => onSelect(token)}
                >
                  <div className="pt-2">
                    <Image
                      src={token.logoURI}
                      alt="n/a"
                      width="25%"
                      height="25%"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-bold">{token.symbol}</div>
                    <div className="text-sm text-gray-200">{token.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TokenList;
