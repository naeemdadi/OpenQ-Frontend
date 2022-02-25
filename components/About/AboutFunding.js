import React from 'react';
import TokenBalances from '../TokenBalances/TokenBalances';
import AboutFundingValue from './AboutFundingValue';

const AboutFunding = ({ organizationFunding, tokenValues }) => {
	return (<div className="w-60 pb-8">
		<dt>
			<ul>
				<TokenBalances
					tokenBalances={organizationFunding}
					tokenValues={tokenValues}
					header={'Current Total Value Locked'}
				/>
			</ul>
		</dt>
	</div>);
};
export default AboutFunding;