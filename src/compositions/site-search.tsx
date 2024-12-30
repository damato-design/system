import { field } from "../components/Field";
import { input } from "../components/Input";
import { icon } from "../components/Icon";

export const SiteSearch = () => {
    return (
        <field.div stretch>
            <input.search name='search' placeholder="What can we help you find today?" />
            <icon.search/>
        </field.div>
    );
}