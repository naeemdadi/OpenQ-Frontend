/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '../../../../test-utils';
import ClaimButton from '.';
import InitialState from '../../../../store/Store/InitialState';
import Constants from '../../../../test-utils/constant';

describe('ClaimButton', () => {
  const bounty = Constants.bounty;

  const refreshBounty = jest.fn();
  const setInternalMenu = jest.fn();

  beforeEach(() => {
    InitialState.openQClient.reset();
  });
  it('should render the button when ready to claim', async () => {
    // ARRANGE
    render(<ClaimButton bounty={bounty} refreshBounty={refreshBounty} setInternalMenu={setInternalMenu} />);
    expect(await screen.findByRole('button')).toHaveClass('cursor-not-allowed');
    expect(
      await screen.findByText(/There are not enough funds locked to claim, contact the maintainer of this issue/)
    ).toBeInTheDocument();
  });
});
