import { box } from '../components/Box';
import { PageHeader } from './page-header';
import { PageFooter } from './page-footer';
import { ReactNode } from 'react';

type PageProps = {
    children: ReactNode,
    stack?: boolean,
}

export const Page = ({ children, stack = true }: PageProps) => {
    return (
        <box.div stack stretch mode='base'>
            <PageHeader/>
            <box.main stack={ stack } stretch padding gap>
                { children }
            </box.main>
            <PageFooter/>
        </box.div>
    )
}
