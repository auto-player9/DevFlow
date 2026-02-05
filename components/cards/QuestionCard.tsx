import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import TagCard from "@/components/cards/TagCard";
import Matric from "../Matric";
import EditDeleteAction from "../user/EditDeleteAction";

interface Props {
    question: Question;
    showActionBtns?: boolean
}

export default function QuestionCard({
    question: {
        _id,
        title,
        description,
        tags,
        author,
        createdAt,
        upvotes,
        answers,
        views
    },
    showActionBtns = false,
}: Props) {
    return (
        <>
            <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
                <div className="flex flex-column-reverse items-start justify-between gap-5 sm:flex-row">
                    <div className="flex-1">
                        <span className="sbutle-regular text-dark400_light700 line-clamp-1 felx sm:hidden">{getTimeStamp(createdAt.toString())}</span>
                        <Link href={ROUTES.QUESTION(_id)}>
                            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                                {title}
                            </h3>
                        </Link>
                        {showActionBtns && <EditDeleteAction type="Question" itemId={_id}/>}
                    </div>
                </div>
                <div className="mt-3.5 flex w-full flex-wrap gap-2">
                    {
                        tags.map((tag: Tag) => (
                            <TagCard key={tag._id} _id={tag._id} name={tag.name} compact isButton={false} />
                        ))
                    }
                </div>
                <div className="flex-between mt-6 w-full flex-wrap gap-3">
                    <Matric href={ROUTES.PROFILE(author._id)} imgUrl={author.image} alt={author.name}
                        value={author.name} title={`asked ${getTimeStamp(createdAt)}`}
                        textStyles="body-medium text-dark400_light700"
                        isAuthor
                        imgStyles={""}
                    />
                    <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                        <Matric imgStyles={""} imgUrl={"/icons/like.svg"} alt="like" value={upvotes} title=" Votes" textStyles="small-medium text-dark400_light800" />
                        <Matric imgStyles={""} imgUrl={"/icons/message.svg"} alt="answers" value={answers} title=" Answers" textStyles="small-medium text-dark400_light800" />
                        <Matric imgStyles={""} imgUrl={"/icons/eye.svg"} alt="views" value={views} title=" Views" textStyles="small-medium text-dark400_light800" />
                    </div>
                </div>

            </div>
        </>
    )
}