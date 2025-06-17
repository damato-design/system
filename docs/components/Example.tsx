import { Story } from '@storybook/blocks';
import { hrefTo } from '@storybook/addon-links';
import { useEffect, useState } from 'react';
import css from './example.module.css'; 

export default function Example({ stories }) {
    const [href, setHref] = useState('');
    const name = stories.default.component?.displayName || stories.default.component.__docgenInfo?.displayName;
    const { title } = stories.default;
    if (!title || !name) return console.error(stories.default.component);
    const [group, component] = title.toLowerCase().split('/');
    const { tags } = stories.default;
    const isDraft = tags && tags.includes('draft');

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
            <div className={ css.title } data-draft={ isDraft }>{ name.split('.')[0] }</div>
        </a>
    );
}
