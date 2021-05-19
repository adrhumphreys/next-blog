import Link from "next/link";
import styled from "styled-components";

const PostsSection = styled.section`
  margin-left: auto;
  margin-right: auto;
  max-width: 674px;
  padding: 0 16px;
`;

const PostsTitle = styled.h1`
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const PostsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PostsListItem = styled.li`
  &:not(:last-of-type) {
    margin-bottom: 50px;
  }
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 5px;
  margin-top: 0;
`;

const Time = styled.time`
  color: ${({ theme }) => theme.colors.darkGrey};
`;

const Posts = ({ posts }) => {
  return (
    <PostsSection>
      <h1>Posts</h1>
      <PostsList>
        {posts.map(({ slug, title, description, date }) => (
          <PostsListItem key={slug}>
            <Heading>
              <Link href={`/posts/${slug}`}>
                <a>{title}</a>
              </Link>
            </Heading>
            <Description>{description}</Description>
            <Time>{date}</Time>
          </PostsListItem>
        ))}
      </PostsList>
    </PostsSection>
  );
};

export default Posts;
