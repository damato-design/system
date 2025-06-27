import { field } from '../components/Field';
import { input } from '../components/Input';
import { icon } from '../components/Icon';

export const SiteSearch = () => {
    return (
        <field.div stretch>
            <input.search name='search'/>
            <icon.search/>
        </field.div>
    );
}