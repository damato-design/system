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
    colorPrimary: '#198278',
    colorSecondary: '#198278',
    appBorderColor: '#198278',
    barSelectedColor: '#198278',
    inputBorder: '#198278',
});

