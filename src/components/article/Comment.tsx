import { useCreateCommentMutation } from '@/queries/articles.query';
import { useGetUserQuery } from '@/queries/user.query';
import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/lib/queryClient';
import { QUERY_COMMENTS_KEY } from '@/constants/query.constant';
import { convertToDate } from '@/lib/utils';

interface ICommentProps {
  comments: any[];
  slug: string;
}

const Comment = ({ comments, slug }: ICommentProps) => {
  console.log(comments);
  const { data } = useGetUserQuery();

  const [newComment, onChangeNewComment, setNewComment] = useInputs({ body: '' });

  const createCommentMutation = useCreateCommentMutation();

  const onPostComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { body } = newComment;
    createCommentMutation.mutate(
      { body, slug },
      {
        onSuccess: (_) => {
          setNewComment({ body: '', slug });
          queryClient.invalidateQueries({ queryKey: [QUERY_COMMENTS_KEY] });
        },
      },
    );
  };

  return (
    <>
      <form className="card comment-form" onSubmit={onPostComment}>
        <div className="card-block">
          <textarea
            className="form-control"
            placeholder="Write a comment..."
            rows={3}
            name="body"
            value={newComment.body}
            onChange={onChangeNewComment}
          ></textarea>
        </div>
        <div className="card-footer">
          <img src={data.image} className="comment-author-img" alt="comment-author" />
          <button type="submit" className="btn btn-sm btn-primary">
            Post Comment
          </button>
        </div>
      </form>

      {comments.map((comment: any, index: number) => (
        <div className="card" key={index}>
          <div className="card-block">
            <p className="card-text">{comment.body}</p>
          </div>
          <div className="card-footer">
            <a href="/" className="comment-author">
              <img src={comment.author.image} className="comment-author-img" alt="comment-author" />
            </a>
            &nbsp;
            <a href="/" className="comment-author">
              {comment.author.username}
            </a>
            <span className="date-posted">{convertToDate(comment.updatedAt)}</span>
            <span className="mod-options">
              <i className="ion-edit"></i>
              <i className="ion-trash-a"></i>
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Comment;
