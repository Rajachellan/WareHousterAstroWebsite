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

const newsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          logo: z.string(), // or z.string() if you're using a URL
          date: z.string(), // ISO format recommended
          describe: z.string(),
          url: z.string().url(),
        })
      ),
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

const parks = defineCollection({
  schema: z.object({
    title: z.string(),

    banner: z.object({
      metrics: z.array(
        z.object({ 
          label: z.object({
            main: z.string(),
            sub: z.string().optional(),
          }) 
        })
      ),
      headline: z.string(),
      description: z.string(),
      image: z.string(),
      advantages: z.array(
        z.object({
          title: z.string(),
          icon: z.string(),
          text: z.string(),
        })
      ),
    }),

    connectivity: z.object({
      heading: z.string(),
      description: z.string(),
      advantages: z.array(
        z.object({
          title: z.string(),
          icon: z.string(),
          text: z.string(),
        })
      ),
      mapEmbed: z.string(),
      distances: z.array(
        z.object({
          name: z.string(),
          icon: z.string(),
          distance: z.string(),
        })
      ),
    }),

    development: z.object({
      heading: z.string(),
      description: z.string(),
      blocks: z.array(
        z.object({
          title: z.string(),
          image: z.string(),
          icon: z.string(),
          description: z.string(),
          highlights: z.array(z.string()),
          metric: z.object({
            number: z.string().optional(),
            content: z.string().optional(),
          }),
          metricDesc: z.string().optional(),
        })
      ),
    }),
  }),
});


export const collections = {
  blog,
  caseStudies,
  leadershipTeam,
  parks,
  news: newsCollection,
};