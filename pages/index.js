// Third Party
import React from 'react';
import Head from 'next/head';

// Custom
import OpenQHomepage from '../components/Homepage/OpenQHomepage';

export default function Index() {
	return (
		<div>
			<Head>
				<title>OpenQ</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div className="flex pl-12 pt-10 flex-col">
					<OpenQHomepage />
				</div>
			</main>
		</div>
	);
}
