import { Link } from "../link.entity";

export const linksMock: Partial<Link>[] = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      link: "https://example.com/article1",
      imgUrl: "https://example.com/image1.jpg",
      title: "Article Title 1",
      publishedDate: new Date("2024-10-04T10:00:00Z"),
      sourceCountry: "BR",
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174000",
      link: "https://example.com/article2",
      imgUrl: null,
      title: "Article Title 2",
      publishedDate: null,
      sourceCountry: "US", 
    },
  ];
  