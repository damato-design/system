import { box } from '../components/Box';
import { PageHeader } from './page-header';
import { PageFooter } from './page-footer';
import { ReactNode } from 'react';

type PageProps = {
    children: ReactNode
}

export const Page = ({ children }: PageProps) => {
    return (
        <box.div stack stretch mode='default:base'>
            <PageHeader/>
            <box.main stack stretch padding gap>
                { children }
            </box.main>
            <PageFooter/>
        </box.div>
    )
}
