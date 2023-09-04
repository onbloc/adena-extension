import AccountDetails, { type AccountDetailsProps } from './account-details';
import { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export default {
  title: 'components/account-details/AccountDetails',
  component: AccountDetails,
} as Meta<typeof AccountDetails>;

export const Default: StoryObj<AccountDetailsProps> = {
  args: {
    originName: '',
    name: '',
    address: '',
    moveGnoscan: () => action('moveGnoscan'),
    moveExportPrivateKey: () => action('moveExportPrivateKey'),
    setName: () => action('setName'),
    reset: () => action('reset'),
  },
};