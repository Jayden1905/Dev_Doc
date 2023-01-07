import React from 'react'
import { InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import NotionService from '../../services/service'
import { motion } from 'framer-motion'
import { pageTransition } from '../../animation/motion'
import BlogDetail from '../../components/BlogDetail'

type ParamsProps = {
  params: {
    slug: string
  }
}

export async function getStaticPaths () {
  const notionService = new NotionService()

  const slugs = await notionService.getSlugs()

  const paths = slugs.map((slug) => ({
    params: {
      slug
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug } }: ParamsProps) => {
  const notionService = new NotionService()

  const p = await notionService.getSingleBlogPost(slug)
  const adjcentPosts = await notionService.getAdjacentPosts(slug)

  if (!p) {
    // throw new Error()
    return {
      notFound: true
    }
  }

  return {
    props: {
      markdown: p.markdown,
      post: p.post,
      adjcentPosts
    },
    revalidate: 30
  }
}

const Post = ({
  markdown,
  post,
  adjcentPosts
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-5xl pb-6"
    >
      <Head>
        <title>{post.title}</title>
        <meta
          name={'description'}
          title={'description'}
          content={post.description}
        />
      </Head>
      <BlogDetail post={post} markdown={markdown} />
    </motion.div>
  )
}

export default Post
