import React from 'react'
import { BlogPost } from '../../interfaces/schema'
import NotionService from '../../services/service'
import SearchCategories from '../../components/SerachCategories'
import BlogWrapper from '../../components/BlogWrapper'
import { NoScrollLayout } from '../../components/layout/NoScrollLayout'

type ParamsProps = {
  params: {
    tag: string
  }
}

type Props = {
  posts: BlogPost[]
  tag: string
}

export const getStaticPaths = async () => {
  const notionService = new NotionService()

  const categories = await notionService.getBlogCategories()

  const paths = categories.map((category) => ({
    params: {
      tag: category.toLowerCase()
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { tag } }: ParamsProps) => {
  const notionService = new NotionService()

  const posts = await notionService.getCategoryPosts(capitalize(tag))

  return {
    props: {
      posts,
      tag
    },
    revalidate: 30
  }
}

export function capitalize (str: string) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function CategoryPage ({ posts, tag }: Props) {
  const filterCategoriesPosts = posts.filter((post) =>
    post.tags.some((item) => item.name.toLowerCase() === tag.toLowerCase())
  )

  return (
    <NoScrollLayout>
      <SearchCategories posts={filterCategoriesPosts} slug={tag} />
      <BlogWrapper posts={filterCategoriesPosts} />
    </NoScrollLayout>
  )
}
