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
    //
    // colorPrimary: '#3A10E5',
    // colorSecondary: '#585C6D',

    // // UI
    // appBg: '#ffffff',
    // appContentBg: '#ffffff',
    // appPreviewBg: '#ffffff',
    // appBorderColor: '#585C6D',
    // appBorderRadius: 4,

    // // Text colors
    // textColor: '#10162F',
    // textInverseColor: '#ffffff',

    // // Toolbar default and active colors
    // barTextColor: '#9E9E9E',
    // barSelectedColor: '#585C6D',
    // barHoverColor: '#585C6D',
    // barBg: '#ffffff',

    // // Form colors
    // inputBg: '#ffffff',
    // inputBorder: '#10162F',
    // inputTextColor: '#10162F',
    // inputBorderRadius: 2,
});

