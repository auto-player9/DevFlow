import { getTags } from "@/lib/actions/tag.actions";

export async function Tags({}) {
    const { success, data, errors } = await getTags({
        page: 1,
        pageSize: 10,
        query: ''
    })

    const { tags } = data || {};

    return (
        <div>

        </div>
    )
}