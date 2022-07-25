// Third party
import React, { useState, useEffect, useContext } from "react";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import axios from "axios";
import Link from 'next/link';
// Custom
import StoreContext from "../../store/Store/StoreContext.js";
import ConnectButton from "../WalletConnect/ConnectButton.js";
import ProfilePicture from "./ProfilePicture.js";
import Image from "next/image";
import FirstTimeBanner from "./FirstTimeBanner";
import Footer from "./Footer.js";
import useWeb3 from "../../hooks/useWeb3.js";
import ToolTipNew from "../Utils/ToolTipNew.js";
import { ThreeBarsIcon } from "@primer/octicons-react";

const Navigation = ({ }) => {

	const [gnosisSafe, setGnosisSafe] = useState();
	const [safeInfo, setSafeInfo] = useState();
	const { account, activate, deactivate } = useWeb3();
	const [appState] = useContext(StoreContext);
	const [openMenu, setOpenMenu] = useState(false);

	useEffect(async () => {
		//const openQPrismaClient = new WrappedOpenQPrismaClient();
		const safe = new SafeAppConnector();
		safe.getSafeInfo().then((data) => {
			if (data) {
				setSafeInfo(data);
				deactivate();
			}
		});
		setGnosisSafe(safe);

		// First tokens + matic
		const GET_PRICES = {
			query: `{
			prices {
    				timestamp
    				priceObj
  			
			}
		}`,
		};
		let tokenPrices = {};

		try {
			if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "local") {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_OPENQ_API_URL}/prices`
				);
				tokenPrices = response.data[0].priceObj;
			} else {
				const response = await axios({
					url: process.env.NEXT_PUBLIC_OPENQ_API_URL,
					method: "post",
					headers: { "content-type": "application/json" },
					data: GET_PRICES,
				});
				tokenPrices = response?.data?.data?.prices?.priceObj || {};
			}
		} catch (err) {
			console.log("could not fetch initial prices", err);
		}

		appState.tokenClient.firstTenPrices = tokenPrices;
	}, []);

	useEffect(async () => {
		if (safeInfo) {
			await activate(gnosisSafe);
		}
	}, [account]);
	const [sidebar, setSidebar] = useState(false);

	return (
		<div className="bg-nav-bg py-1 ">
			<FirstTimeBanner />

			{/* Desktop view */}

			<div className="flex flex-row invisible absolute md:visible md:relative">

				<div className="flex w-full flex-col md:py-1 justify-center">

					<div className="flex justify-between px-7">
						<div className="flex flex-row space-x-5 items-center">
							<Link href={'/'}>
								<a className="flex items-center">
									<Image
										src="/openq-logo-white-2.png"
										alt="OpenQ"
										width="31"
										height="31"
									/>
								</a>
							</Link>
							<input
								className="flex justify-between pr-24 items-center input-field"
								onKeyUp={(e) => setQuickSearch(e.target.value)}
								type="text"
								placeholder="Search OpenQ"
							></input>
							<Link href={'/'}>
								<a className="flex items-center">
									<div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
										Atomic contracts
									</div>
								</a>
							</Link>
							<ToolTipNew toolTipText={'Coming soon'} >
								<div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
									Contests
								</div>
							</ToolTipNew>
							<ToolTipNew toolTipText={'Coming soon'} >
								<div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
									Communities
								</div>
							</ToolTipNew>
							<ToolTipNew toolTipText={'Coming soon'} >
								<div className="text-[0.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
									Explore
								</div>
							</ToolTipNew>
						</div>
						<div className="flex flex-row items-center">
							<div>
								<ConnectButton />
							</div>
							<div>
								<ProfilePicture />
							</div>
						</div>
					</div>
					<div
						className={`pt-18 justify-center${sidebar ? "opacity-20" : null}`}
					></div>
				</div>
			</div>

			{/* Mobile view */}

			<div className="flex flex-row visible relative md:invisible md:absolute">
				<div className="flex w-full flex-col md:py-1 justify-center ">

					<div className="flex justify-between px-7">
						<div className="flex flex-row space-x-5 items-center">
							<Link href={'/'}>
								<a className="flex items-center p-4">
									<Image
										src="/openq-logo-white-2.png"
										alt="OpenQ"
										width="62"
										height="62"
									/>
								</a>
							</Link>
							<button onClick={() => setOpenMenu(!openMenu)}>
								<ThreeBarsIcon size={44} />
							</button>
							{openMenu ?
								<div className="flex absolute">
									<div className="flex flex-col mt-12 p-12 space-x-2 space-y-4 absolute bg-dark-mode">
										<input
											className="flex justify-between pr-24 items-center input-field text-[1.8rem]"
											onKeyUp={(e) => setQuickSearch(e.target.value)}
											type="text"
											placeholder="Search OpenQ"
										></input>
										<Link href={'/'} className="flex">
											<a className="flex items-center">
												<div className="text-[1.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer">
													Atomic contracts
												</div>
											</a>
										</Link>
										<ToolTipNew toolTipText={'Coming soon'} >
											<div className="flex text-[1.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
												Contests
											</div>
										</ToolTipNew>
										<ToolTipNew toolTipText={'Coming soon'} >
											<div className="flex text-[1.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
												Communities
											</div>
										</ToolTipNew>
										<ToolTipNew toolTipText={'Coming soon'} >
											<div className="flex text-[1.8rem] tracking-wider text-nav-text font-bold hover:text-gray-500 hover:cursor-pointer opacity-20">
												Explore
											</div>
										</ToolTipNew>
									</div>
								</div>
								:
								null
							}

						</div>
						<div className="flex flex-row items-center pr-6 ">
							<div  className="pr-5">
								<ConnectButton mobile={true}/>
							</div>
							<div>
								<ProfilePicture mobile={true}/>
							</div>
						</div>
					</div>
					<div
						className={`pt-18 justify-center${sidebar ? "opacity-20" : null}`}
					></div>
				</div>
			</div>
			{/*   <Footer /> */}
		</div>
	);
};

export default Navigation;
