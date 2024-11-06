import React from "react";
import { addons } from '@storybook/manager-api';
import theme from './theme';

addons.setConfig({
    showToolbar: false,
    sidebar: {
        renderLabel: (item) => {
            if ('tags' in item && item.tags.includes('draft')) {
                return <span className='nav-label'>{ item.name } <span>draft</span></span>
            }

            return <span className='nav-label'>{ item.name }</span>
        }
    },
    theme,
});
