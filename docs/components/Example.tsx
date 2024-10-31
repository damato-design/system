import { Story } from '@storybook/blocks';
import { hrefTo } from '@storybook/addon-links';
import React, { useEffect, useState } from 'react';
import css from './example.module.css'; 

export default function Example({ stories }) {
    const { displayName } = stories.default.component;
    const [group, component] = stories.default.title.toLowerCase().split('/');

    const [href, setHref] = useState('');

    useEffect(() => {
        // http://localhost:6006/?path=/docs/components-button--docs
        hrefTo(component, 'docs').then((res) => {
            // http://localhost:6006/?path=/story/button--docs
            const url = new URL(res);
            url.search = `path=/docs/${group}-${component}--docs`;
            setHref(url.toString());
        });
    }, [component]);

    return (
        <a className={ css.card } href={href}>
            <div className={ css.window }>
                <figure className={ css.example }>
                    <Story of={ stories.Default } meta={ stories } inline={ true } />
                </figure>
            </div>
            <div className={ css.title }>{ displayName.split('.')[0] }</div>
        </a>
    );
}