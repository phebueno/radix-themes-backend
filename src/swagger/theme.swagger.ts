export const paramSchema = {
  name: 'id',
  description: "Theme's uuid",
  example: '4780fb5e-c1b6-43bb-b9ed-63b6babda107',
};

export const pageQuerySchema = {
  name: 'page',
  required: false,
  description: 'Page number for pagination. Default is 1.',
  example: 1,
};

export const limitQuerySchema = {
  name: 'limit',
  required: false,
  description: 'Number of items per page. Default is 10.',
  example: 10,
};

export const offsetQuerySchema = {
  name: 'offset',
  required: false,
  description: 'Offset for pagination. Default is 0.',
  example: 0,
};

export const exampleResponseSchema = {
  themes: [
    {
      id: 'b1e1f4fa-1234-4dca-a0fb-3e2bb2b7cd9a',
      title: 'Example Theme',
      keywords: 'example, theme',
      status: 'PENDING',
      createdAt: '2024-10-04T12:00:00Z',
      updatedAt: '2024-10-04T12:00:00Z',
    },
  ],
  meta: {
    total: 50,
    hasMore: true,
  },
};
