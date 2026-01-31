import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRender";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

export default async function Community({ searchParams }: RouteParams) {
    const { page, pageSize, query, filter } = await searchParams;

    const { success, data, errors } = await getUsers({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query,
        filter: filter,
    });

    const { users, isNext } = data || {};



    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">All Users</h1>

            <div className="mt-11">
                <LocalSearch
                    route={ROUTES.COMMUNITY}
                    iconPosition="left"
                    imgSrc="/icons/search.svg"
                    placeholder="There are some great devs here!"
                    otherClasses="flex-1"
                />
            </div>

            <DataRenderer
                success={success}
                empty={EMPTY_USERS}
                errors={errors}
                data={users}
                render={(users) => (
                    <div className="mt-12 flex flex-wrap gap-5">
                        {
                            users.map((user) => (
                                <UserCard key={user._id} {...user} />
                            ))
                        }
                    </div>
                )}
            />
        </div>
    )
}
