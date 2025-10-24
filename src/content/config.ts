import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    slug: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    area: z.number(),
    buildArea: z.number(),
  })
})

const leadershipTeam = defineCollection({
  schema: z.object({
    id:z.number(),
    name: z.string(),
    description: z.string(),
    image: z.string(),
    role: z.string(),
  })
})


export const collections = {
  blog,
  caseStudies,
  leadershipTeam,
};