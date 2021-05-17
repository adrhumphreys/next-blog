import Link from "next/link";
import styled from "styled-components";

const PostsSection = styled.section`
  position: relative;
  z-index: 1;
`;

const Posts = ({ posts }) => {
  return (
    <PostsSection>
      <ul>
        {posts.map(({ slug, title, description, date }) => (
          <li key={slug}>
            <Link href={`/posts/${slug}`}>
              <a>
                <p>{title}</p>
                <p>{description}</p>
                <p>{date}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </PostsSection>
  );
};

export default Posts;
