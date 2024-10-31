import { create } from '@storybook/theming';
import logo from './public/logo.svg';

export default create({
    base: 'dark',
    brandTitle: "D'Amato Design System",
    brandUrl: 'https://system.damato.design',
    brandImage: logo,
    brandTarget: '_self',
    fontBase: '"Plus Jakarta Sans", sans-serif',
    fontCode: 'monospace',
    colorPrimary: '#4fb9af',
    colorSecondary: '#4fb9af',
    appBorderColor: '#4fb9af',
    barSelectedColor: '#4fb9af',
    inputBorder: '#4fb9af',
});

