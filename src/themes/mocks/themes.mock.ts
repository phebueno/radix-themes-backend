import { ThemeStatus } from '../enums/theme-status.enum';

export const themesMock = [
  {
    id: '1',
    title: 'Theme 1',
    keywords: 'keyword1',
    status: ThemeStatus.PENDING,
    createdAt: new Date(), // Data atual ou uma data específica
  updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Theme 2',
    keywords: 'keyword2',
    status: ThemeStatus.PENDING,
    createdAt: new Date(), // Data atual ou uma data específica
  updatedAt: new Date(),
  },
];
